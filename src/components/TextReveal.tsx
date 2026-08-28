import React from 'react';
import { motion } from 'motion/react';

interface StaggeredHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  delay?: number;
  staggerDuration?: number;
  duration?: number;
  once?: boolean;
  editorialMask?: boolean;
  highlightWords?: string[];
  highlightClassName?: string;
}

export function StaggeredHeading({
  text,
  as = 'h2',
  className = '',
  delay = 0.1,
  staggerDuration = 0.05,
  duration = 0.8,
  once = true,
  editorialMask = true,
  highlightWords = [],
  highlightClassName = 'text-[#60a5fa]',
}: StaggeredHeadingProps) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDuration,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: editorialMask
      ? {
          y: '115%',
          opacity: 0,
          rotateZ: 2,
          filter: 'blur(6px)',
        }
      : {
          y: 24,
          opacity: 0,
          filter: 'blur(8px)',
        },
    visible: {
      y: '0%',
      opacity: 1,
      rotateZ: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1], // Editorial luxury ease curve
      },
    },
  };

  const Tag = motion[as] as React.ElementType;

  return (
    <Tag
      className={`inline-flex flex-wrap items-baseline gap-x-[0.28em] gap-y-[0.1em] ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
    >
      {words.map((word, idx) => {
        const isHighlighted = highlightWords.some(
          (hw) => hw.toLowerCase() === word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
        );

        return (
          <span
            key={idx}
            className={`inline-block ${
              editorialMask ? 'overflow-hidden py-[0.08em] -my-[0.08em]' : ''
            }`}
          >
            <motion.span
              variants={wordVariants}
              className={`inline-block ${
                isHighlighted ? highlightClassName : ''
              }`}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}

/**
 * Editorial Subheading or Pill Badge reveal component
 */
interface StaggeredBadgeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function StaggeredBadge({
  children,
  className = '',
  delay = 0,
}: StaggeredBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
