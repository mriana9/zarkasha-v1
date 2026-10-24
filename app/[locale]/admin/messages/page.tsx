"use client";

import { useState, use } from "react";
import { Search, Trash2, Send, MessageCircle, CheckCheck } from "lucide-react";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "notReplied">(
    "all",
  );

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "1",
      senderName: isRtl ? "مرسلة 1" : "Sender 1",
      senderEmail: "sender1@example.com",
      senderPhone: "+962700000001",
      subject: isRtl ? "طلب قطعة خاصة" : "Custom Piece Request",
      preview: isRtl
        ? "نص الرسالة يظهر هنا باختصار..."
        : "Message preview text here...",
      fullMessage: isRtl
        ? "نص رسالة العميلة: تفاصيل القطعة والألوان والمناسبة..."
        : "Customer message text: details about the piece, colors, and occasion...",
      type: "custom",
      time: isRtl ? "منذ ساعة" : "1 hour ago",
      date: "2026-06-14",
      isRead: false,
      isReplied: false,
    },
    {
      id: "2",
      senderName: isRtl ? "مرسلة 2" : "Sender 2",
      senderEmail: "sender2@example.com",
      senderPhone: "+962700000002",
      subject: isRtl ? "استفسار" : "Inquiry",
      preview: isRtl
        ? "نص الرسالة يظهر هنا باختصار..."
        : "Message preview text here...",
      fullMessage: isRtl
        ? "استفسار بخصوص موعد توصيل التطريزات إلى عمان..."
        : "Inquiry regarding delivery times to Amman...",
      type: "inquiry",
      time: isRtl ? "منذ ساعة" : "1 hour ago",
      date: "2026-06-14",
      isRead: true,
      isReplied: true,
    },
    {
      id: "3",
      senderName: isRtl ? "مرسلة 3" : "Sender 3",
      senderEmail: "sender3@example.com",
      senderPhone: "+962700000003",
      subject: isRtl ? "طلب قطعة خاصة" : "Custom Piece Request",
      preview: isRtl
        ? "نص الرسالة يظهر هنا باختصار..."
        : "Message preview text here...",
      fullMessage: isRtl
        ? "أرغب بتصميم ثوب مطرز تراثي بمقاس خاص..."
        : "I would like to design a traditional embroidered thobe with custom sizing...",
      type: "custom",
      time: isRtl ? "منذ ساعة" : "1 hour ago",
      date: "2026-06-13",
      isRead: true,
      isReplied: false,
    },
    {
      id: "4",
      senderName: isRtl ? "مرسلة 4" : "Sender 4",
      senderEmail: "sender4@example.com",
      senderPhone: "+962700000004",
      subject: isRtl ? "استفسار" : "Inquiry",
      preview: isRtl
        ? "نص الرسالة يظهر هنا باختصار..."
        : "Message preview text here...",
      fullMessage: isRtl
        ? "هل يتوفر الشحن الدولي لكندا؟"
        : "Is international shipping to Canada available?",
      type: "inquiry",
      time: isRtl ? "منذ ساعة" : "1 hour ago",
      date: "2026-06-12",
      isRead: false,
      isReplied: false,
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<MessageItem>(
    messages[0],
  );
  const [replyText, setReplyText] = useState("");

  // Counts for Badges
  const unreadCount = messages.filter((m) => !m.isRead).length;
  const notRepliedCount = messages.filter((m) => !m.isReplied).length;

  // Filter logic
  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterTab === "unread") return matchesSearch && !m.isRead;
    if (filterTab === "notReplied") return matchesSearch && !m.isReplied;
    return matchesSearch;
  });

  const handleSelectMessage = (msg: MessageItem) => {
    setSelectedMessage(msg);
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)),
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    if (selectedMessage?.id === id && updated.length > 0) {
      setSelectedMessage(updated[0]);
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    setMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMessage.id
          ? { ...m, isReplied: true, isRead: true }
          : m,
      ),
    );
    setSelectedMessage((prev) => ({ ...prev, isReplied: true, isRead: true }));

    alert(isRtl ? "تم إرسال الرد بنجاح!" : "Reply sent successfully!");
    setReplyText("");
  };

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

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <a
                    href={`https://wa.me/${selectedMessage.senderPhone}?text=${encodeURIComponent(replyText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setMessages((prev) =>
                        prev.map((m) =>
                          m.id === selectedMessage.id
                            ? { ...m, isReplied: true, isRead: true }
                            : m,
                        ),
                      );
                      setSelectedMessage((prev) => ({
                        ...prev,
                        isReplied: true,
                        isRead: true,
                      }));
                    }}
                    className="px-5 py-2.5 bg-[#25D366] text-white rounded-[3px] text-xs font-medium hover:bg-[#20ba5a] transition-colors shadow-xs flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.whatsappBtn}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleSendReply}
                    className="px-6 py-2.5 bg-burgundy text-ivory rounded-[3px] text-xs font-medium hover:bg-burgundy/90 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
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

          {/* Filter Badges under Search */}
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
                className={`px-1.5 py-0.2 rounded-full text-[9px] ${filterTab === "unread" ? "bg-ivory/20 text-ivory" : "bg-burgundy/10 text-burgundy font-bold"}`}
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
                className={`px-1.5 py-0.2 rounded-full text-[9px] ${filterTab === "notReplied" ? "bg-ivory/20 text-ivory" : "bg-olive/15 text-olive font-bold"}`}
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
                  onClick={() => handleSelectMessage(msg)}
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
