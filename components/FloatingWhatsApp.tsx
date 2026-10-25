"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface FloatingWhatsAppProps {
  locale: "ar" | "en";
}

interface QuickQuestion {
  id: string;
  ar: string;
  en: string;
}

const quickQuestions: QuickQuestion[] = [
  {
    id: "1",
    ar: "استفسار عن قطع التطريز المتاحة",
    en: "Inquiry about available embroidery pieces",
  },
  {
    id: "2",
    ar: "معرفة تفاصيل الأسعار والمقاسات",
    en: "Details about prices and sizes",
  },
  {
    id: "3",
    ar: "تتبع حالة الطلب الخاص بي",
    en: "Track my order status",
  },
];

export function FloatingWhatsApp({ locale }: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customMessage, setCustomMessage] = useState<string>("");

  const isRtl: boolean = locale === "ar";
  const phoneNumber: string = "970592749303";

  const content = {
    title: isRtl ? "خدمة العملاء - زركشة" : "Zarkasha Customer Care",
    subtitle: isRtl ? "عادة الرد خلال دقائق" : "Typically replies in minutes",
    welcomeText: isRtl
      ? "أهلاً بكِ! كيف يمكننا مساعدتك اليوم في اختيار قطع التطريز الفلسطينية الأصيلة؟"
      : "Welcome! How can we help you choose authentic Palestinian embroidery today?",
    placeholder: isRtl ? "اكتبي رسالتك هنا..." : "Type your message here...",
    sendButton: isRtl ? "إرسال" : "Send",
  };

  const handleSendMessage = (text: string) => {
    const encodedMessage = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    handleSendMessage(customMessage);
    setCustomMessage("");
  };

  return (
    <div className={`fixed bottom-6 ${isRtl ? "right-6" : "left-6"} z-50 font-tajawal`} dir={isRtl ? "rtl" : "ltr"}>
      {isOpen && (
        <div className="absolute bottom-16 w-80 sm:w-96 bg-[#fbf9f6] border border-burgundy/20 rounded-lg shadow-xl overflow-hidden flex flex-col mb-2">
          <div className="bg-burgundy text-ivory p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ivory/10 flex items-center justify-center font-amiri text-lg">
                ز
              </div>
              <div>
                <h3 className="font-medium text-sm">{content.title}</h3>
                <p className="text-[10px] text-blush/80 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  {content.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ivory/80 hover:text-ivory transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-[#f7f5f2] flex-1 space-y-3 max-h-80 overflow-y-auto">
            <div className="bg-ivory border border-burgundy/10 p-3 rounded-lg text-xs text-brown leading-relaxed shadow-2xs">
              {content.welcomeText}
            </div>

            <div className="space-y-1.5 pt-2">
              <p className="text-[11px] font-semibold text-brown/70 px-1">
                {isRtl ? "أسئلة شائعة:" : "Frequent Questions:"}
              </p>
              {quickQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSendMessage(q[locale])}
                  className="w-full text-start p-2.5 bg-ivory hover:bg-burgundy/5 border border-burgundy/10 rounded-[4px] text-xs text-brown transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <span>{q[locale]}</span>
                  <span className="text-olive">→</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-3 bg-ivory border-t border-burgundy/10 flex gap-2">
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={content.placeholder}
              className="flex-1 h-10 px-3 bg-[#fbf9f6] border border-burgundy/20 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy"
            />
            <button
              type="submit"
              className="h-10 px-4 bg-burgundy text-ivory rounded-[3px] text-xs font-medium hover:bg-burgundy/90 transition-colors flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 cursor-pointer relative"
        aria-label="WhatsApp Chat"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-burgundy text-ivory rounded-full text-[10px] flex items-center justify-center font-bold">
          1
        </span>
      </button>
    </div>
  );
}