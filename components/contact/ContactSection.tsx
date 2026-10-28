"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Camera, Mail, Send, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ContactSectionProps {
  dict?: {
    breadcrumb?: { home: string; current: string };
    kicker?: string;
    titlePart1?: string;
    titlePart2?: string;
    description?: string;
    form?: {
      title: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      subjectLabel: string;
      subjectOptions: {
        custom: string;
        inquiry: string;
        general: string;
      };
      messageLabel: string;
      messagePlaceholder: string;
      submitButton: string;
      submitting: string;
      successMessage: string;
      errorMessage?: string;
    };
    info?: {
      whatsappTitle: string;
      whatsappSub: string;
      instagramTitle: string;
      instagramSub: string;
      emailTitle: string;
      emailSub: string;
    };
  };
  locale: string;
}

export function ContactSection({ dict, locale }: ContactSectionProps) {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [contactSettings, setContactSettings] = useState({
    whatsapp: "",
    instagram: "",
    email: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "custom",
    message: "",
  });

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["whatsapp", "instagram", "admin_email"]);

      if (!error && data) {
        const settingsMap: {
          whatsapp: string;
          instagram: string;
          email: string;
        } = {
          whatsapp: "",
          instagram: "",
          email: "",
        };

        data.forEach((item) => {
          if (item.key === "whatsapp") settingsMap.whatsapp = item.value;
          if (item.key === "instagram") settingsMap.instagram = item.value;
          if (item.key === "email") settingsMap.email = item.value;
        });

        setContactSettings(settingsMap);
      }
    }

    void fetchSettings();
  }, [supabase]);

  const breadcrumb = dict?.breadcrumb || {
    home: "الرئيسية",
    current: "تواصل معنا",
  };
  const kicker = dict?.kicker || "نحب أن نسمع منكِ";
  const titlePart1 = dict?.titlePart1 || "هل لديكِ فكرة";
  const titlePart2 = dict?.titlePart2 || "تنتظر أن تُطرّز؟";
  const description =
    dict?.description ||
    "سواء كنتِ تبحثين عن قطعة خاصة لمناسبة مميزة، أو لديكِ استفسار عن منتجاتنا؛ نحن هنا لنحكي معاً حكاية قطعتكِ القادمة.";

  const form = dict?.form || {
    title: "أرسلي لنا رسالة",
    nameLabel: "الاسم الكامل",
    namePlaceholder: "أدخلي اسمكِ الكريم",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "example@domain.com",
    phoneLabel: "رقم الهاتف / الواتساب",
    phonePlaceholder: "059XXXXXXXX",
    subjectLabel: "نوع الطلب",
    subjectOptions: {
      custom: "طلب قطعة خاصة / مطرزة باسم",
      inquiry: "استفسار عن طلب قائم",
      general: "استفسار عام",
    },
    messageLabel: "رسالتكِ / تفاصيل الفكرة",
    messagePlaceholder: "اكتبي تفاصيل القطعة، الألوان المفضلّة، أو المناسبة...",
    submitButton: "إرسال الرسالة",
    submitting: "جاري الإرسال...",
    successMessage: "تم إرسال رسالتكِ بنجاح! سنتواصل معكِ في أقرب وقت.",
    errorMessage: "حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقاً.",
  };

  const info = dict?.info || {
    whatsappTitle: "تواصل سريع عبر واتساب",
    whatsappSub: "متواجدون للرد على استفساراتكِ المباشرة",
    instagramTitle: "تابعي يومياتنا على إنستغرام",
    instagramSub: "شاهد كواليس العمل والتفاصيل الجديدة",
    emailTitle: "البريد الإلكتروني",
    emailSub: "للاستفسارات والتعاون",
  };

  // دالة بسيطة لتنظيف النصوص ومنع حقن الأكواد الخبيثة
  const sanitizeInput = (text: string) => {
    return text.replace(/<[^>]*>?/gm, "").trim();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // فالتشن رقم الهاتف (إذا تم إدخاله، يجب أن يكون 10 أرقام تماماً)
    if (formData.phone.trim() !== "") {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        toast.error(
          locale === "ar"
            ? "رقم الهاتف يجب أن يتكون من 10 أرقام فقط"
            : "Phone number must be exactly 10 digits",
        );
        return;
      }
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("contact_messages").insert({
      full_name: sanitizeInput(formData.fullName),
      email: formData.email ? sanitizeInput(formData.email) : null,
      phone: formData.phone ? sanitizeInput(formData.phone) : null,
      subject: sanitizeInput(formData.subject),
      message: sanitizeInput(formData.message),
    });

    if (error) {
      console.error(error);
      toast.error(form.errorMessage || "حدث خطأ أثناء إرسال الرسالة");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSent(true);
    toast.success(form.successMessage);
  };

  const cleanWhatsapp = contactSettings.whatsapp.replace(/\D/g, "");
  const whatsappHref = cleanWhatsapp
    ? `https://wa.me/+97${cleanWhatsapp}`
    : "https://wa.me/";
  const instagramHref = contactSettings.instagram
    ? `https://instagram.com/${contactSettings.instagram.replace("@", "")}`
    : "https://instagram.com";
  const emailHref = contactSettings.email
    ? `mailto:${contactSettings.email}`
    : "#";

  return (
    <section className="bg-ivory py-[80px] px-[6vw]">
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-[10px] text-[#887a75] text-[11px] font-tajawal mb-6">
          <Link href={`/${locale}`} className="text-burgundy hover:underline">
            {breadcrumb.home}
          </Link>
          <span className="text-blush">/</span>
          <span>{breadcrumb.current}</span>
        </div>

        <span className="flex items-center gap-[10px] text-olive text-xs font-bold tracking-[1.08em] mb-3">
          <span className="w-[32px] h-[1px] bg-olive" />
          {kicker}
        </span>

        <h1 className="text-burgundy font-amiri text-[clamp(48px,5vw,76px)] font-normal leading-[1.4] tracking-[-0.03em] max-w-2xl mb-4">
          {titlePart1}
          <br />
          <em className="text-olive font-normal not-italic">{titlePart2}</em>
        </h1>

        <p className="text-[#6e5f59] text-base sm:text-lg leading-[1.9] max-w-xl font-tajawal m-0">
          {description}
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-start">
        <div className="space-y-6">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-beige/40 border border-burgundy/12 rounded-[4px] flex items-start gap-5 group hover:border-burgundy/35 transition-all block"
          >
            <div className="w-12 h-12 rounded-full bg-burgundy text-ivory grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="m-0 mb-1 text-burgundy font-amiri text-xl font-normal">
                {info.whatsappTitle}
              </h3>
              <p className="m-0 text-[#887a75] text-xs font-tajawal leading-relaxed">
                {contactSettings.whatsapp || info.whatsappSub}
              </p>
            </div>
          </a>

          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-beige/40 border border-burgundy/12 rounded-[4px] flex items-start gap-5 group hover:border-burgundy/35 transition-all block"
          >
            <div className="w-12 h-12 rounded-full bg-olive text-ivory grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="m-0 mb-1 text-burgundy font-amiri text-xl font-normal">
                {info.instagramTitle}
              </h3>
              <p className="m-0 text-[#887a75] text-xs font-tajawal leading-relaxed">
                {contactSettings.instagram || info.instagramSub}
              </p>
            </div>
          </a>

          <a
            href={emailHref}
            className="p-6 bg-beige/40 border border-burgundy/12 rounded-[4px] flex items-start gap-5 group hover:border-burgundy/35 transition-all block"
          >
            <div className="w-12 h-12 rounded-full bg-blush text-burgundy grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="m-0 mb-1 text-burgundy font-amiri text-xl font-normal">
                {info.emailTitle}
              </h3>
              <p className="m-0 text-[#887a75] text-xs font-tajawal leading-relaxed">
                {contactSettings.email || info.emailSub}
              </p>
            </div>
          </a>
        </div>

        <div className="p-8 sm:p-10 bg-burgundy text-ivory rounded-[4px] shadow-sm">
          <h2 className="m-0 mb-8 font-amiri text-3xl sm:text-4xl font-normal">
            {form.title}
          </h2>

          {isSent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 text-center space-y-4"
            >
              <CheckCircle2 className="w-14 h-14 text-blush mx-auto" />
              <p className="text-lg font-tajawal leading-relaxed max-w-md mx-auto text-ivory">
                {form.successMessage}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-tajawal mb-2 text-ivory/80">
                  {form.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder={form.namePlaceholder}
                  className="w-full h-12 px-4 bg-white/10 border border-white/20 rounded-[2px] text-ivory placeholder:text-white/40 font-tajawal text-sm outline-none focus:border-blush transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-tajawal mb-2 text-ivory/80">
                    {form.emailLabel}
                  </label>
                  <input
                    type="email"
                    maxLength={100}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder={form.emailPlaceholder}
                    className="w-full h-12 px-4 bg-white/10 border border-white/20 rounded-[2px] text-ivory placeholder:text-white/40 font-tajawal text-sm outline-none focus:border-blush transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-tajawal mb-2 text-ivory/80">
                    {form.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => {
                      // السماح فقط بالأرقام ومنع الحروف والرموز نهائياً
                      const numericValue = e.target.value.replace(/\D/g, "");
                      if (numericValue.length <= 10) {
                        setFormData({ ...formData, phone: numericValue });
                      }
                    }}
                    placeholder={form.phonePlaceholder}
                    className="w-full h-12 px-4 bg-white/10 border border-white/20 rounded-[2px] text-ivory placeholder:text-white/40 font-tajawal text-sm outline-none focus:border-blush transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-tajawal mb-2 text-ivory/80">
                  {form.subjectLabel}
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full h-12 px-4 bg-burgundy border border-white/20 rounded-[2px] text-ivory font-tajawal text-sm outline-none focus:border-blush transition-colors cursor-pointer"
                >
                  <option value="custom" className="bg-burgundy text-ivory">
                    {form.subjectOptions.custom}
                  </option>
                  <option value="inquiry" className="bg-burgundy text-ivory">
                    {form.subjectOptions.inquiry}
                  </option>
                  <option value="general" className="bg-burgundy text-ivory">
                    {form.subjectOptions.general}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-tajawal mb-2 text-ivory/80">
                  {form.messageLabel}
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder={form.messagePlaceholder}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-[2px] text-ivory placeholder:text-white/40 font-tajawal text-sm outline-none focus:border-blush transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-13 bg-ivory text-burgundy hover:bg-white font-tajawal font-medium text-sm rounded-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:-translate-y-0.5 disabled:opacity-70"
              >
                <span>
                  {isSubmitting ? form.submitting : form.submitButton}
                </span>
                {!isSubmitting && <Send className="w-4 h-4 rtl:rotate-180" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
