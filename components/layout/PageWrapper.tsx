"use client";

import React from "react";
import { motion } from "framer-motion";
import { pageTransitions } from "@/animations/variants/transitions";

export const PageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitions}
      className={className}
    >
      {children}
    </motion.div>
  );
};
