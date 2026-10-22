"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function HeroImages() {
  return (
    <div className="relative min-h-[520px] lg:min-h-[660px]">
      <div className="absolute inset-0 start-0 lg:start-[15%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#45101b]/15 z-10 pointer-events-none" />

        <motion.div
          initial={{ scale: 1.25, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{
            scale: { duration: 1.8, ease: [0.25, 1, 0.5, 1] },
            opacity: { duration: 1.2 },
          }}
          className="relative w-full h-full"
        >
          <Image
            src="/hero/hero.webp"
            alt="Zarkasha Palestinian Dress"
            fill
            priority
            className="object-cover object-[center_30%]"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "backOut" }}
        className="absolute start-4 lg:start-[11%] top-[8%] lg:top-[12%] w-[48px] lg:w-[64px] h-[48px] lg:h-[64px] grid place-items-center rounded-full text-burgundy bg-ivory text-[23px] shadow-sm z-20"
        aria-hidden="true"
      >
        ✣
      </motion.div>
    </div>
  );
}
