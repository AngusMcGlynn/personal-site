"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function HomepageOverlay() {
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Top-left identity */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-8 left-8 z-30 pointer-events-none"
      >
        <h1 className="text-lg font-sans text-heading">Angus McGlynn</h1>
        <p className="text-sm text-secondary mt-1">
          building, reading, writing things down
        </p>
      </motion.div>

      {/* Bottom-center hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showHint ? 1 : 0 }}
        transition={{ duration: showHint ? 0.6 : 1.0, delay: showHint ? 0.8 : 0 }}
        className="fixed bottom-8 left-0 right-0 z-30 text-center pointer-events-none"
      >
        <p className="text-xs text-secondary">click any node to explore</p>
      </motion.div>
    </>
  );
}
