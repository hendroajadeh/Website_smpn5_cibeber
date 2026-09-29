"use client";

import { motion, AnimatePresence, HTMLMotionProps } from "motion/react";
import React from "react";
import { usePathname } from "next/navigation";

// ============================================================================
// ANIMATION & MOTION SYSTEM
// 
// Principles:
// - Subtle, professional, functional.
// - Fade in, slight translate, very light scale, opacity transition.
// - Respects prefers-reduced-motion.
// ============================================================================

export const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const easeOutConfig = [0.25, 0.1, 0.25, 1] as const;

export const pageTransitionVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutConfig } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: easeOutConfig } },
};

export const fadeInVariants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutConfig } },
  exit: { opacity: 0, y: 4, transition: { duration: 0.3, ease: easeOutConfig } },
};

// ----------------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------------

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageTransitionVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0, className, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-20px" }}
      variants={{
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutConfig, delay } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInStagger({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-20px" }}
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInStaggerItem({ children, className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutConfig } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// For dialogs, modals, and dropdowns
export const scaleInVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: easeOutConfig } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15, ease: easeOutConfig } },
};

export function ScaleIn({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={scaleInVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
