"use client";

import { motion } from "motion/react";
import React from "react";

const ease = [0.25, 0.1, 0.25, 1] as const;

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease } },
};

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial="initial" animate="animate" variants={variants} className={className}>
      {children}
    </motion.div>
  );
}
