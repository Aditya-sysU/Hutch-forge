import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "1mb" }));

interface ContactSubmission {
  id: string;
  timestamp: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  existingUrl: string;
  engagementType: string;
  budgetRange: string;
  serviceRequired: string[];
  projectBrief: string;
  status: "received" | "processed" | "synced_sheet";
  sheetDestination: string;
  sheetSynced: boolean;
  notes?: string;
}

const GOOGLE_SPREADSHEET_ID = "127L19i22HR0FwLkEo8Q2Lx2165ylHvaV9r_aWbBcMCY";
const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SPREADSHEET_ID}/edit?gid=1734040678#gid=1734040678`;
const GOOGLE_SHEET_WEBHOOK_URL =
  process.env.GOOGLE_SHEET_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbxcz80_9789htQ6EbX2vuyttSiEU6xzV5qvnKwh6XEoSyBx9PBfHeBZ2hmjFl-gt4n5cw/exec";

const SUBMISSIONS_FILE = path.join(process.cwd(), "submissions-log.json");

function loadSubmissions(): ContactSubmission[] {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const data = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading submissions log:", err);
  }
  return [];
}

function saveSubmission(submission: ContactSubmission) {
  try {
    const list = loadSubmissions();
    list.unshift(submission);
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving submission log:", err);
  }
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    studio: "Hutchforge",
    spreadsheetId: GOOGLE_SPREADSHEET_ID,
    timestamp: new Date().toISOString(),
  });
});

// Submissions list
app.get("/api/submissions", (_req, res) => {
  const submissions = loadSubmissions();
  res.json({
    count: submissions.length,
    sheetUrl: SPREADSHEET_URL,
    submissions,
  });
});

// Contact / Start a Project submission pipeline with Google Sheet logging
app.post("/api/contact", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      company,
      existingUrl,
      engagementType,
      budgetRange,
      serviceRequired,
      projectBrief,
      googleAccessToken,
    } = req.body;

    // Validation
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return res.status(400).json({ error: "Full Name is required." });
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ error: "A valid Email address is required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Please provide a valid email format." });
    }

    if (!company || typeof company !== "string" || !company.trim()) {
      return res.status(400).json({ error: "Company or Brand name is required." });
    }

    if (
      !serviceRequired ||
      !Array.isArray(serviceRequired) ||
      serviceRequired.length === 0
    ) {
      return res.status(400).json({
        error: "Please select at least one service required.",
      });
    }

    if (!projectBrief || typeof projectBrief !== "string" || projectBrief.trim().length < 15) {
      return res.status(400).json({
        error: "Please provide a project brief with at least 15 characters.",
      });
    }

    const submissionId = `HF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    let sheetSynced = false;
    let syncNote = "Logged to secure Hutchforge submission queue.";

    // 1. If client provided Google OAuth token, append directly to Google Sheet via Google Sheets API v4
    const tokenToUse = googleAccessToken || (req.headers.authorization ? req.headers.authorization.replace(/^Bearer\s+/i, '') : null);

    if (tokenToUse) {
      try {
        const rowValues = [
          [
            new Date().toLocaleString('en-US', { timeZone: 'UTC' }),
            submissionId,
            fullName.trim(),
            email.trim(),
            company.trim(),
            existingUrl ? existingUrl.trim() : "N/A",
            engagementType || "project",
            budgetRange || "Standard",
            serviceRequired.join(", "),
            projectBrief.trim(),
          ],
        ];

        const range = "Sheet1!A:J";
        const sheetApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SPREADSHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

        const sheetRes = await fetch(sheetApiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ values: rowValues }),
        });

        if (sheetRes.ok) {
          sheetSynced = true;
          syncNote = "Autofilled directly into your Google Sheet via Google Sheets API.";
        } else {
          const errData = await sheetRes.json().catch(() => ({}));
          console.warn("Google Sheets API direct append status:", sheetRes.status, errData);
        }
      } catch (sheetErr) {
        console.warn("Google Sheets API append exception:", sheetErr);
      }
    }

    // 2. Forward to Google Apps Script Webhook
    if (GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        const payload = {
          submissionId,
          timestamp,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone ? phone.trim() : "N/A",
          company: company.trim(),
          existingUrl: existingUrl ? existingUrl.trim() : "N/A",
          engagementType: engagementType || "project",
          budgetRange: budgetRange || "Standard",
          serviceRequired: Array.isArray(serviceRequired) ? serviceRequired : [serviceRequired],
          projectBrief: projectBrief.trim(),
        };

        const webhookRes = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
          redirect: "follow",
        });

        if (webhookRes.ok || webhookRes.status === 200 || webhookRes.status === 302) {
          sheetSynced = true;
          syncNote = "Autofilled directly into your Google Sheet via Apps Script Webhook.";
          console.log(`[GOOGLE SHEETS SYNC] Successfully transmitted ${submissionId} to Google Sheet.`);
        } else {
          console.warn(`[GOOGLE SHEETS SYNC] Webhook returned status ${webhookRes.status}`);
          // Attempt fallback with application/json
          const retryRes = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            redirect: "follow",
          });
          if (retryRes.ok) {
            sheetSynced = true;
            syncNote = "Autofilled into Google Sheet.";
          }
        }
      } catch (webhookErr) {
        console.warn("[GOOGLE SHEETS SYNC] Webhook dispatch exception:", webhookErr);
      }
    }

    const record: ContactSubmission = {
      id: submissionId,
      timestamp,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : "",
      company: company.trim(),
      existingUrl: existingUrl ? existingUrl.trim() : "",
      engagementType: engagementType || "project",
      budgetRange: budgetRange || "Standard",
      serviceRequired,
      projectBrief: projectBrief.trim(),
      status: sheetSynced ? "synced_sheet" : "processed",
      sheetDestination: SPREADSHEET_URL,
      sheetSynced,
      notes: syncNote,
    };

    saveSubmission(record);

    console.log(`[HUTCHFORGE INTAKE] Project brief received: [${submissionId}] ${fullName} (${company}) <${email}>`);
    console.log(`[HUTCHFORGE INTAKE] Google Sheet Target: ${SPREADSHEET_URL} | Synced: ${sheetSynced}`);

    return res.status(200).json({
      success: true,
      message: "Thank you, your request has been received and our team will reach out to you shortly.",
      referenceId: submissionId,
      sheetSynced,
      timestamp,
      details: {
        fullName: record.fullName,
        company: record.company,
        email: record.email,
        serviceRequired: record.serviceRequired,
        engagementType: record.engagementType,
        budgetRange: record.budgetRange,
      },
    });
  } catch (error: any) {
    console.error("Contact submission error:", error);
    return res.status(500).json({
      error: "An error occurred while processing your request. Please try again or email direct@hutchforge.studio",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hutchforge server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
