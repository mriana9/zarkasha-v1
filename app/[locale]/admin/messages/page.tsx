"use client";

import { useState, useEffect, use } from "react";
import {
  Search,
  Trash2,
  Send,
  MessageCircle,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface MessageItem {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  subject: string;
  preview: string;
  fullMessage: string;
  type: "custom" | "inquiry";
  time: string;
  date: string;
  isRead: boolean;
  isReplied: boolean;
}

interface MessagesPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export default function AdminMessagesPage({ params }: MessagesPageProps) {
  const supabase = createClient();
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isRtl = locale === "ar";

  const t = {
    title: isRtl ? "الرسائل" : "Messages",
    subtitle: isRtl
      ? 'رسائل نموذج "تواصل معنا" وطلبات القطع الخاصة'
      : '"Contact Us" messages and custom piece requests',
    searchPlaceholder: isRtl ? "ابحث عن رسالة..." : "Search message...",
    badgeCustom: isRtl ? "طلب قطعة خاصة" : "Custom Order",
    badgeInquiry: isRtl ? "استفسار" : "Inquiry",
    replyPlaceholder: isRtl ? "اكتبي ردك هنا..." : "Write your reply here...",
    sendEmailBtn: isRtl ? "إرسال الرد بالبريد" : "Send Reply via Email",
    whatsappBtn: isRtl ? "الرد عبر واتساب" : "Reply via WhatsApp",
    repliedLabel: isRtl ? "تم الرد" : "Replied",
    filters: {
      all: isRtl ? "الكل" : "All",
      unread: isRtl ? "غير مقروءة" : "Unread",
      notReplied: isRtl ? "لم يتم الرد عليها" : "Pending Reply",
    },
  };

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "notReplied">(
    "all",
  );
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        toast.error(isRtl ? "فشل تحميل الرسائل" : "Failed to load messages");
      } else if (data) {
        const formatted: MessageItem[] = data.map((item) => {
          const msgText = item.message || "";
          return {
            id: item.id,
            senderName: item.full_name || (isRtl ? "مجهول" : "Unknown"),
            senderEmail: item.email || "",
            senderPhone: item.phone || "",
            subject:
              item.subject === "custom"
                ? isRtl
                  ? "طلب قطعة خاصة / مطرزة باسم"
                  : "Custom Piece Request"
                : item.subject === "inquiry"
                  ? isRtl
                    ? "استفسار عن طلب قائم"
                    : "Order Inquiry"
                  : isRtl
                    ? "استفسار عام"
                    : "General Inquiry",
            preview:
              msgText.length > 40 ? msgText.slice(0, 40) + "..." : msgText,
            fullMessage: msgText,
            type: item.subject === "custom" ? "custom" : "inquiry",
            time: new Date(item.created_at).toLocaleTimeString(
              locale === "ar" ? "ar-SA" : "en-US",
              { hour: "2-digit", minute: "2-digit" },
            ),
            date: new Date(item.created_at).toLocaleDateString("en-CA"),
            isRead: item.is_read ?? false,
            isReplied: item.is_replied ?? false,
          };
        });

        setMessages(formatted);
        if (formatted.length > 0) {
          setSelectedMessage(formatted[0]);
        }
      }
      setLoading(false);
    }

    void fetchMessages();
  }, [supabase, isRtl, locale]);

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const notRepliedCount = messages.filter((m) => !m.isReplied).length;

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.senderEmail.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterTab === "unread") return matchesSearch && !m.isRead;
    if (filterTab === "notReplied") return matchesSearch && !m.isReplied;
    return matchesSearch;
  });

  const handleSelectMessage = async (msg: MessageItem) => {
    setSelectedMessage(msg);
    setReplyText(""); // مسح الرد القديم عند الانتقال لرسالة أخرى

    if (!msg.isRead) {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", msg.id);

      if (!error) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)),
        );
      }
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      toast.error(isRtl ? "فشل حذف الرسالة" : "Failed to delete message");
      return;
    }

    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    if (selectedMessage?.id === id) {
      setSelectedMessage(updated.length > 0 ? updated[0] : null);
      setReplyText("");
    }
    toast.success(
      isRtl ? "تم حذف الرسالة بنجاح" : "Message deleted successfully",
    );
  };

  const markAsReplied = async (id: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_replied: true, is_read: true })
      .eq("id", id);

    if (!error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, isReplied: true, isRead: true } : m,
        ),
      );
      setSelectedMessage((prev) =>
        prev ? { ...prev, isReplied: true, isRead: true } : null,
      );
    }
  };

  const handleWhatsAppReply = async () => {
    if (!selectedMessage) return;
    await markAsReplied(selectedMessage.id);

    const messageContent = isRtl
      ? `مرحباً ${selectedMessage.senderName}،\n\nبخصوص رسالتكِ: "${selectedMessage.fullMessage}"\n\nالرد:\n${replyText}`
      : `Hello ${selectedMessage.senderName},\n\nRegarding your message: "${selectedMessage.fullMessage}"\n\nReply:\n${replyText}`;

    const cleanPhone = selectedMessage.senderPhone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/+97${cleanPhone}?text=${encodeURIComponent(
      messageContent,
    )}`;
    window.open(whatsappUrl, "_blank");
    toast.success(
      isRtl
        ? "تم فتح واتساب وتحديث حالة الرسالة"
        : "Opened WhatsApp and updated status",
    );
  };

  const handleEmailReply = async () => {
    if (!selectedMessage) return;
    await markAsReplied(selectedMessage.id);

    const emailSubject = encodeURIComponent(
      `Re: ${selectedMessage.subject} - Zarkasha`,
    );
    const emailBody = encodeURIComponent(
      isRtl
        ? `مرحباً ${selectedMessage.senderName}،\n\nبخصوص رسالتكِ السابقة:\n"${selectedMessage.fullMessage}"\n\n--------------------------\n${replyText}`
        : `Hello ${selectedMessage.senderName},\n\nRegarding your previous message:\n"${selectedMessage.fullMessage}"\n\n--------------------------\n${replyText}`,
    );

    const mailtoUrl = `mailto:${selectedMessage.senderEmail}?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = mailtoUrl;
    toast.success(
      isRtl
        ? "تم فتح البريد الإلكتروني وتحديث حالة الرسالة"
        : "Opened email client and updated status",
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-burgundy animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-tajawal max-w-7xl mx-auto">
      <div>
        <h1 className="font-amiri text-3xl font-normal text-burgundy">
          {t.title}
        </h1>
        <p className="text-xs text-[#887a75] mt-1">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active Message Reading & Reply Panel */}
        <div className="lg:col-span-8 bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 shadow-xs space-y-6">
          {selectedMessage ? (
            <>
              <div className="flex items-center justify-between border-b border-burgundy/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-amiri text-2xl font-normal text-burgundy">
                      {selectedMessage.subject}
                    </h2>
                    {selectedMessage.isReplied && (
                      <span className="px-2 py-0.5 bg-olive/12 text-olive rounded-[2px] text-[10px] font-medium flex items-center gap-1">
                        <CheckCheck className="w-3 h-3" />
                        <span>{t.repliedLabel}</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#887a75] block mt-0.5">
                    [{selectedMessage.senderName}] · [
                    {selectedMessage.senderEmail}] · [
                    {selectedMessage.senderPhone}]
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDelete(selectedMessage.id, e)}
                  className="p-2 text-[#887a75] hover:text-burgundy transition-colors cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-ivory border border-burgundy/10 rounded-[3px] text-xs text-brown leading-relaxed min-h-[100px]">
                {selectedMessage.fullMessage}
              </div>

              <div className="space-y-3 pt-2">
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t.replyPlaceholder}
                  className="w-full p-4 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy resize-none"
                />

                <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppReply}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#25D366] text-white rounded-[3px] text-xs font-medium hover:bg-[#20ba5a] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.whatsappBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleEmailReply}
                    className="w-full sm:w-auto px-6 py-2.5 bg-burgundy text-ivory rounded-[3px] text-xs font-medium hover:bg-burgundy/90 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.sendEmailBtn}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-[#887a75] text-xs">
              {isRtl ? "لا توجد رسائل محددة" : "No message selected"}
            </div>
          )}
        </div>

        {/* Messages List Sidebar */}
        <div className="lg:col-span-4 bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-4 shadow-xs space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full h-10 px-3 ${isRtl ? "pr-8" : "pl-8"} bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy placeholder:text-[#a0928d]`}
            />
            <Search
              className={`w-3.5 h-3.5 text-[#a0928d] absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2`}
            />
          </div>

          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1 rounded-[20px] text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
                filterTab === "all"
                  ? "bg-burgundy text-ivory shadow-xs"
                  : "bg-ivory text-brown border border-burgundy/15 hover:bg-burgundy/5"
              }`}
            >
              {t.filters.all} ({messages.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterTab("unread")}
              className={`px-3 py-1 rounded-[20px] text-[11px] font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                filterTab === "unread"
                  ? "bg-burgundy text-ivory shadow-xs"
                  : "bg-ivory text-brown border border-burgundy/15 hover:bg-burgundy/5"
              }`}
            >
              <span>{t.filters.unread}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                  filterTab === "unread"
                    ? "bg-ivory/20 text-ivory"
                    : "bg-burgundy/10 text-burgundy font-bold"
                }`}
              >
                {unreadCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterTab("notReplied")}
              className={`px-3 py-1 rounded-[20px] text-[11px] font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                filterTab === "notReplied"
                  ? "bg-burgundy text-ivory shadow-xs"
                  : "bg-ivory text-brown border border-burgundy/15 hover:bg-burgundy/5"
              }`}
            >
              <span>{t.filters.notReplied}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                  filterTab === "notReplied"
                    ? "bg-ivory/20 text-ivory"
                    : "bg-olive/15 text-olive font-bold"
                }`}
              >
                {notRepliedCount}
              </span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => void handleSelectMessage(msg)}
                  className={`p-3.5 rounded-[3px] border transition-all cursor-pointer space-y-1.5 relative ${
                    selectedMessage?.id === msg.id
                      ? "bg-ivory border-burgundy/30 shadow-xs"
                      : msg.isRead
                        ? "bg-ivory/40 border-burgundy/10 hover:bg-ivory"
                        : "bg-[#fff2ef] border-burgundy/20 hover:bg-ivory"
                  }`}
                >
                  {!msg.isRead && (
                    <span
                      className="absolute top-3.5 left-3.5 w-2 h-2 rounded-full bg-burgundy"
                      title="Unread"
                    />
                  )}

                  <div className="flex items-center justify-between pr-4">
                    <span
                      className={`text-xs ${!msg.isRead ? "font-bold text-burgundy" : "font-semibold text-brown"}`}
                    >
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-[#887a75]">
                      {msg.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-brown flex items-center gap-1.5">
                      {msg.isReplied && (
                        <CheckCheck className="w-3.5 h-3.5 text-olive shrink-0" />
                      )}
                      <span>{msg.subject}</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-[2px] text-[9px] font-medium ${
                        msg.type === "custom"
                          ? "bg-[#f5e6e8] text-[#8a2b3b]"
                          : "bg-burgundy/10 text-burgundy"
                      }`}
                    >
                      {msg.type === "custom" ? t.badgeCustom : t.badgeInquiry}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#887a75] line-clamp-1">
                    {msg.preview}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-[#887a75] text-xs">
                {isRtl ? "لا توجد رسائل مطابقة" : "No matching messages"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
