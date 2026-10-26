"use client";

import { useState, use, useEffect, Fragment } from "react";
import Image from "next/image";
import {
  Eye,
  MessageCircle,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Loader2,
  FileEdit,
  User,
  MapPin,
  Phone,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  city: string;
  address: string;
  total: string;
  paymentMethod: string;
  status: "new" | "processing" | "shipping" | "completed" | "cancelled";
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  phone: string;
  notes?: string;
  date: string;
}

interface OrdersPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export default function AdminOrdersPage({ params }: OrdersPageProps) {
  const supabase = createClient();
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isRtl = locale === "ar";

  const t = {
    title: isRtl ? "الطلبات" : "Orders",
    subtitle: isRtl
      ? "متابعة الطلبات وتحديث حالتها"
      : "Track and update order statuses",
    exportExcel: isRtl ? "تصدير Excel / Sheets" : "Export Excel / Sheets",
    exportPdf: isRtl ? "تصدير PDF" : "Export PDF",
    tabs: {
      all: isRtl ? "الكل" : "All",
      new: isRtl ? "جديد" : "New",
      processing: isRtl ? "قيد التجهيز" : "Processing",
      shipping: isRtl ? "قيد التوصيل" : "Out for Delivery",
      completed: isRtl ? "مكتمل" : "Completed",
      cancelled: isRtl ? "ملغي" : "Cancelled",
    },
    table: {
      orderId: isRtl ? "رقم الطلب" : "Order ID",
      customer: isRtl ? "العميلة" : "Customer",
      city: isRtl ? "المدينة/المنطقة" : "City/Region",
      total: isRtl ? "الإجمالي" : "Total",
      payment: isRtl ? "الدفع" : "Payment",
      status: isRtl ? "الحالة" : "Status",
      actions: isRtl ? "الإجراءات" : "Actions",
    },
    statusNames: {
      new: isRtl ? "جديد" : "New",
      processing: isRtl ? "قيد التجهيز" : "Processing",
      shipping: isRtl ? "قيد التوصيل" : "Out for Delivery",
      completed: isRtl ? "مكتمل" : "Completed",
      cancelled: isRtl ? "ملغي" : "Cancelled",
    },
    details: {
      orderTitle: (num: string) => (isRtl ? `طلب ${num}` : `Order ${num}`),
      quantity: isRtl ? "الكمية:" : "Qty:",
      statusLabel: isRtl ? "حالة الطلب" : "Order Status",
      updateBtn: isRtl ? "تحديث الحالة" : "Update Status",
      whatsappBtn: isRtl
        ? "مراسلة العميلة عبر واتساب"
        : "Message Customer on WhatsApp",
      notesLabel: isRtl ? "ملاحظات الطلب:" : "Order Notes:",
    },
  };

  const [activeTab, setActiveTab] = useState<string>("all");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<{
    [key: string]: OrderItem["status"];
  }>({});

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        toast.error(isRtl ? "فشل تحميل الطلبات" : "Failed to load orders");
      } else if (data) {
        const formattedOrders: OrderItem[] = data.map((item) => {
          const shipping = item.shipping_address || {};
          return {
            id: item.id,
            orderNumber: item.order_number || `ZR-${item.id.slice(0, 4)}`,
            customerName: shipping.full_name || (isRtl ? "عميلة" : "Customer"),
            city: shipping.region || (isRtl ? "غير محدد" : "N/A"),
            address:
              shipping.address ||
              (isRtl ? "لا يوجد عنوان تفصيلي" : "No detailed address"),
            total: item.total_amount ? item.total_amount.toString() : "0",
            paymentMethod:
              item.payment_method === "cash_on_delivery"
                ? isRtl
                  ? "الدفع عند الاستلام"
                  : "Cash on Delivery"
                : item.payment_method,
            status: item.status || "new",
            items: shipping.items || [],
            phone: shipping.phone || "",
            notes: item.notes || shipping.notes || "",
            date: new Date(item.created_at).toLocaleDateString(
              locale === "ar" ? "ar-SA" : "en-US",
              {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              },
            ),
          };
        });

        setOrders(formattedOrders);
        const initialStatusMap: { [key: string]: OrderItem["status"] } = {};
        formattedOrders.forEach((ord) => {
          initialStatusMap[ord.id] = ord.status;
        });
        setStatusUpdates(initialStatusMap);
      }
      setLoading(false);
    }

    void fetchOrders();
  }, [supabase, isRtl, locale]);

  const getStatusBadge = (status: OrderItem["status"]) => {
    switch (status) {
      case "new":
        return "bg-[#f5e6e8] text-[#8a2b3b]";
      case "processing":
        return "bg-[#ebdcd3] text-[#786358]";
      case "shipping":
        return "bg-[#e2e8d5] text-[#55632a]";
      case "completed":
        return "bg-[#d4edda] text-[#155724]";
      case "cancelled":
        return "bg-[#f8d7da] text-[#721c24]";
    }
  };

  const filteredOrders =
    activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

  const handleUpdateStatus = async (orderId: string) => {
    const newStatus = statusUpdates[orderId];
    if (!newStatus) return;

    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      console.error(error);
      toast.error(
        isRtl ? "فشل تحديث حالة الطلب" : "Failed to update order status",
      );
      return;
    }

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: newStatus } : ord,
      ),
    );
    toast.success(
      isRtl ? "تم تحديث حالة الطلب بنجاح" : "Order status updated successfully",
    );
  };

  const handleExportExcel = () => {
    let csv =
      "\uFEFFرقم الطلب,العميلة,المدينة,العنوان,الهاتف,الإجمالي,طريقة الدفع,الملاحظات,الحالة,التاريخ\n";
    filteredOrders.forEach((o) => {
      csv += `"${o.orderNumber}","${o.customerName}","${o.city}","${o.address}","${o.phone}","${o.total}","${o.paymentMethod}","${o.notes || "-"}","${t.statusNames[o.status]}","${o.date}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `zarkasha_orders_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPdf = () => {
    window.print();
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-amiri text-3xl font-normal text-burgundy">
            {t.title}
          </h1>
          <p className="text-xs text-[#887a75] mt-1">{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-olive text-ivory rounded-[3px] text-xs font-medium hover:bg-olive/90 transition-colors shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{t.exportExcel}</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-burgundy text-ivory rounded-[3px] text-xs font-medium hover:bg-burgundy/90 transition-colors shadow-xs cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t.exportPdf}</span>
          </button>
        </div>
      </div>

      <div className="bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center gap-2 border-b border-burgundy/10 pb-4">
          {[
            { id: "all", label: t.tabs.all },
            { id: "new", label: t.tabs.new },
            { id: "processing", label: t.tabs.processing },
            { id: "shipping", label: t.tabs.shipping },
            { id: "completed", label: t.tabs.completed },
            { id: "cancelled", label: t.tabs.cancelled },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-[20px] text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-burgundy text-ivory shadow-xs"
                  : "bg-ivory text-brown border border-burgundy/15 hover:bg-burgundy/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#887a75]">
              {isRtl ? "لا توجد طلبات متاحة حالياً" : "No orders available"}
            </div>
          ) : (
            <table className="w-full text-xs text-start border-collapse">
              <thead>
                <tr className="border-b border-burgundy/10 text-[#887a75] font-medium">
                  <th className="py-3 px-3 text-start font-normal">
                    {t.table.orderId}
                  </th>
                  <th className="py-3 px-3 text-start font-normal">
                    {t.table.customer}
                  </th>
                  <th className="py-3 px-3 text-start font-normal">
                    {t.table.city}
                  </th>
                  <th className="py-3 px-3 text-center font-normal">
                    {t.table.total}
                  </th>
                  <th className="py-3 px-3 text-center font-normal">
                    {t.table.payment}
                  </th>
                  <th className="py-3 px-3 text-center font-normal">
                    {t.table.status}
                  </th>
                  <th className="py-3 px-3 text-center font-normal">
                    {t.table.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-burgundy/5">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const currentStatus = statusUpdates[order.id] || order.status;

                  return (
                    <Fragment key={order.id}>
                      <tr
                        className={`hover:bg-burgundy/5 transition-colors ${
                          isExpanded ? "bg-burgundy/5" : ""
                        }`}
                      >
                        <td className="py-3.5 px-3 font-semibold text-burgundy">
                          {order.orderNumber}
                        </td>
                        <td className="py-3.5 px-3 text-brown">
                          {order.customerName}
                        </td>
                        <td className="py-3.5 px-3 text-[#74655f]">
                          {order.city}
                        </td>
                        <td className="py-3.5 px-3 text-center font-medium text-brown">
                          {order.total} {locale === "ar" ? "شيكل" : "ILS"}
                        </td>
                        <td className="py-3.5 px-3 text-center text-[#74655f]">
                          {order.paymentMethod}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[10px] font-medium ${getStatusBadge(
                              order.status,
                            )}`}
                          >
                            {t.statusNames[order.status]}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedOrderId(isExpanded ? null : order.id)
                            }
                            className="p-1 text-[#887a75] hover:text-burgundy transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>

                      {/* صف التفاصيل مع حركة Smooth باستخدام transition */}
                      <tr className="bg-burgundy/5">
                        <td colSpan={7} className="p-0 border-0">
                          <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              isExpanded
                                ? "max-h-[1000px] opacity-100 p-4"
                                : "max-h-0 opacity-0 p-0"
                            }`}
                          >
                            <div className="bg-ivory border border-burgundy/15 rounded-[4px] p-5 space-y-4 shadow-inner">
                              <div className="flex items-center justify-between border-b border-burgundy/10 pb-3">
                                <h3 className="font-amiri text-xl font-normal text-burgundy">
                                  {t.details.orderTitle(order.orderNumber)}
                                </h3>
                                <span className="text-xs text-[#887a75]">
                                  {order.date}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white border border-burgundy/10 rounded-[3px] text-xs">
                                <div className="flex items-center gap-2 text-brown">
                                  <User className="w-4 h-4 text-burgundy shrink-0" />
                                  <div>
                                    <span className="block text-[10px] text-[#887a75]">
                                      {isRtl ? "العميلة" : "Customer"}
                                    </span>
                                    <span className="font-semibold">
                                      {order.customerName}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-brown">
                                  <MapPin className="w-4 h-4 text-burgundy shrink-0" />
                                  <div>
                                    <span className="block text-[10px] text-[#887a75]">
                                      {isRtl ? "العنوان" : "Address"}
                                    </span>
                                    <span>
                                      {order.city} - {order.address}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-brown">
                                  <Phone className="w-4 h-4 text-burgundy shrink-0" />
                                  <div>
                                    <span className="block text-[10px] text-[#887a75]">
                                      {isRtl ? "الهاتف" : "Phone"}
                                    </span>
                                    <span dir="ltr">{order.phone}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <span className="font-semibold text-xs text-brown block">
                                  {isRtl
                                    ? "المنتجات المطلوبة:"
                                    : "Ordered Products:"}
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {order.items.map((prod, idx) => (
                                    <div
                                      key={idx}
                                      className="bg-white border border-burgundy/10 rounded-[3px] p-3 flex items-center gap-3"
                                    >
                                      <div className="relative w-12 h-12 rounded-[3px] overflow-hidden bg-beige/40 shrink-0 border border-burgundy/10">
                                        <Image
                                          src={
                                            prod.image || "/categories/book.png"
                                          }
                                          alt={prod.title}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-xs text-burgundy truncate">
                                          {prod.title}
                                        </h4>
                                        <span className="text-[10px] text-[#887a75]">
                                          {t.details.quantity} {prod.quantity} ·{" "}
                                          {prod.price}{" "}
                                          {locale === "ar" ? "شيكل" : "ILS"}
                                        </span>
                                      </div>
                                      <span className="text-xs font-semibold text-burgundy shrink-0">
                                        {prod.price * prod.quantity}{" "}
                                        {locale === "ar" ? "شيكل" : "ILS"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {order.notes && (
                                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-[3px] space-y-1">
                                  <div className="flex items-center gap-1.5 text-amber-800 text-xs font-medium">
                                    <FileEdit className="w-3.5 h-3.5 shrink-0" />
                                    <span>{t.details.notesLabel}</span>
                                  </div>
                                  <p className="text-xs text-amber-900 leading-relaxed">
                                    {order.notes}
                                  </p>
                                </div>
                              )}

                              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-burgundy/10">
                                <div className="w-full sm:w-1/2 flex items-center gap-2">
                                  <select
                                    value={currentStatus}
                                    onChange={(e) =>
                                      setStatusUpdates({
                                        ...statusUpdates,
                                        [order.id]: e.target
                                          .value as OrderItem["status"],
                                      })
                                    }
                                    className="flex-1 h-10 px-3 bg-white border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy cursor-pointer"
                                  >
                                    <option value="new">
                                      {t.statusNames.new}
                                    </option>
                                    <option value="processing">
                                      {t.statusNames.processing}
                                    </option>
                                    <option value="shipping">
                                      {t.statusNames.shipping}
                                    </option>
                                    <option value="completed">
                                      {t.statusNames.completed}
                                    </option>
                                    <option value="cancelled">
                                      {t.statusNames.cancelled}
                                    </option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateStatus(order.id)}
                                    className="h-10 px-4 bg-burgundy text-ivory rounded-[3px] text-xs font-medium hover:bg-burgundy/90 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>{t.details.updateBtn}</span>
                                  </button>
                                </div>

                                <div className="w-full sm:w-1/2">
                                  <a
                                    href={`https://wa.me/${order.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                                      locale === "ar"
                                        ? `مرحباً ${order.customerName}، بخصوص طلبك رقم ${order.orderNumber}...`
                                        : `Hello ${order.customerName}, regarding your order ${order.orderNumber}...`,
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full h-10 bg-[#25D366] text-white rounded-[3px] text-xs font-medium hover:bg-[#20ba5a] transition-colors shadow-xs flex items-center justify-center gap-2"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{t.details.whatsappBtn}</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
