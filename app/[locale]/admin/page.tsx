import Link from "next/link";
import {
  ShoppingBag,
  Package,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { getDictionary } from "@/lib/dictionary";

export const instant = false;

interface AdminDashboardProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export default async function AdminDashboardPage({
  params,
}: AdminDashboardProps) {
  const { locale } = await params;

  const t = {
    stats: {
      totalProducts: locale === "ar" ? "إجمالي المنتجات" : "Total Products",
      newOrders: locale === "ar" ? "طلبات جديدة" : "New Orders",
      unreadMessages: locale === "ar" ? "رسائل غير مقروءة" : "Unread Messages",
    },
    recentOrders: {
      title: locale === "ar" ? "أحدث الطلبات الخاصة" : "Recent Custom Orders",
      viewAll: locale === "ar" ? "عرض الكل" : "View All",
      statusNew: locale === "ar" ? "جديد" : "New",
      statusProcessing: locale === "ar" ? "قيد التنفيذ" : "Processing",
    },
    recentMessages: {
      title: locale === "ar" ? "آخر الرسائل الاستفسارية" : "Recent Inquiries",
      viewAll: locale === "ar" ? "عرض الكل" : "View All",
    },
  };

  const stats = [
    { title: t.stats.totalProducts, value: "12", icon: ShoppingBag },
    { title: t.stats.newOrders, value: "5", icon: Package },
    { title: t.stats.unreadMessages, value: "3", icon: MessageSquare },
  ];

  return (
    <div className="space-y-10 font-tajawal max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-[#fff8f6] p-7 rounded-[3px] border border-burgundy/12 flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-olive tracking-wider block">
                  {stat.title}
                </span>
                <h3 className="font-amiri text-4xl font-normal text-burgundy">
                  {stat.value}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full border border-burgundy/16 bg-ivory grid place-items-center text-burgundy">
                <Icon className="w-5 h-5 text-burgundy" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#fff8f6] p-8 rounded-[3px] border border-burgundy/12">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-burgundy/12">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-olive" />
              <h2 className="font-amiri text-2xl font-normal text-burgundy">
                {t.recentOrders.title}
              </h2>
            </div>
            <Link
              href={`/${locale}/admin/orders`}
              className="text-xs text-olive hover:underline flex items-center gap-1 font-medium"
            >
              <span>{t.recentOrders.viewAll}</span>
              <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-90 ltr:rotate-0" />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-ivory rounded-[2px] border border-burgundy/10 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-burgundy">
                  {locale === "ar"
                    ? 'طوق شعر مطرز باسم "مريم"'
                    : 'Personalized Hairband "Mariam"'}
                </p>
                <span className="text-[11px] text-[#887a75] mt-0.5 block">
                  {locale === "ar" ? "قبل ساعتين" : "2 hours ago"}
                </span>
              </div>
              <span className="px-3 py-1 bg-olive/12 text-olive rounded-[2px] text-[10px] font-medium">
                {t.recentOrders.statusNew}
              </span>
            </div>

            <div className="p-4 bg-ivory rounded-[2px] border border-burgundy/10 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-burgundy">
                  {locale === "ar"
                    ? "فاصل كتاب بتطريز المرمية"
                    : "Sage Stitch Bookmark"}
                </p>
                <span className="text-[11px] text-[#887a75] mt-0.5 block">
                  {locale === "ar" ? "أمس" : "Yesterday"}
                </span>
              </div>
              <span className="px-3 py-1 bg-burgundy/10 text-burgundy rounded-[2px] text-[10px] font-medium">
                {t.recentOrders.statusProcessing}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#fff8f6] p-8 rounded-[3px] border border-burgundy/12">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-burgundy/12">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-burgundy" />
              <h2 className="font-amiri text-2xl font-normal text-burgundy">
                {t.recentMessages.title}
              </h2>
            </div>
            <Link
              href={`/${locale}/admin/messages`}
              className="text-xs text-olive hover:underline flex items-center gap-1 font-medium"
            >
              <span>{t.recentMessages.viewAll}</span>
              <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-90 ltr:rotate-0" />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-ivory rounded-[2px] border border-burgundy/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-xs text-burgundy">
                  {locale === "ar" ? "سارة أحمد" : "Sarah Ahmed"}
                </span>
                <span className="text-[10px] text-[#887a75] font-mono">
                  10:30
                </span>
              </div>
              <p className="text-xs text-[#6e5f59] leading-relaxed line-clamp-2">
                {locale === "ar"
                  ? "هل يمكن تعديل لون الخيط في الثوب إلى العنابي الغامق؟"
                  : "Is it possible to change the thread color to dark burgundy?"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
