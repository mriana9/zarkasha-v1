"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";

interface ContactSectionProps {
  dict: {
    kicker: string;
    titlePart1: string;
    titlePart2: string;
    emailLabel: string;
    placeholder: string;
    notice: string;
  };
}

export function ContactSection({ dict }: ContactSectionProps) {
  const [notice, setNotice] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(dict.notice);
  };

  return (
    <section
      className="py-[90px] px-[8vw] grid grid-cols-1 lg:grid-cols-2 items-center gap-[8vw] bg-olive text-white"
      id="contact"
    >
      <div>
        <span className="flex items-center gap-[10px] text-ivory/80 text-xs font-bold tracking-[0.08em] mb-3">
          <span className="w-[32px] h-[1px] bg-ivory/80" />
          {dict.kicker}
        </span>
        <h2 className="m-0 font-amiri text-[50px] font-normal leading-[1.15]">
          {dict.titlePart1}
          <br />
          {dict.titlePart2}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <label className="block">
          <span className="block mb-[14px] font-tajawal text-[13px]">
            {dict.emailLabel}
          </span>
          <div className="grid grid-cols-[1fr_55px] border-b border-white/55 items-center">
            <input
              type="email"
              required
              placeholder={dict.placeholder}
              aria-label={dict.emailLabel}
              className="h-[58px] border-0 outline-0 text-white bg-transparent direction-ltr text-right font-tajawal placeholder:text-white/60"
            />
            <button
              type="submit"
              aria-label="إرسال"
              className="border-0 bg-transparent text-white cursor-pointer grid place-items-center h-full"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </label>
        {notice && (
          <p
            className="mt-3 text-white/75 text-[12px] font-tajawal"
            role="status"
          >
            {notice}
          </p>
        )}
      </form>
    </section>
  );
}
