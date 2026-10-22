"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  dict: {
    title: string;
    items: FaqItem[];
  };
}

export function FaqSection({ dict }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-[110px] px-[6vw] bg-ivory" id="faq">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-center font-amiri text-[clamp(40px,4vw,58px)] text-burgundy font-normal mb-12">
          {dict.title}
        </h2>

        <div className="space-y-6">
          {dict.items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border-b border-[#5d1826]/16 pb-6 text-start"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between gap-4 text-start bg-transparent border-0 cursor-pointer group"
                >
                  <h3 className="font-amiri text-2xl sm:text-3xl text-burgundy font-normal group-hover:opacity-80 transition-opacity">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-burgundy shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-[#6e5f59] font-tajawal text-base sm:text-lg leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
