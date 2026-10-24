"use client";

import { useState, use } from "react";
import Image from "next/image";
import { Eye, MessageCircle, CheckCircle2 } from "lucide-react";

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  city: string;
  total: string;
  paymentMethod: string;
  status: "new" | "processing" | "shipping" | "completed" | "cancelled";
  productName: string;
  quantity: number;
  productImage: string;
  date: string;
}

interface OrdersPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export default function AdminOrdersPage({ params }: OrdersPageProps) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isRtl = locale === "ar";

  const t = {
    title: isRtl ? "الطلبات" : "Orders",
    subtitle: isRtl
      ? "متابعة الطلبات وتحديث حالتها"
      : "Track and update order statuses",
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
      city: isRtl ? "المدينة" : "City",
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
      subtitle: (status: string, payment: string) => `${status} · ${payment}`,
      quantity: isRtl ? "الكمية:" : "Qty:",
      statusLabel: isRtl ? "حالة الطلب" : "Order Status",
      updateBtn: isRtl ? "تحديث الحالة" : "Update Status",
      whatsappBtn: isRtl
        ? "مراسلة العميلة عبر واتساب"
        : "Message Customer on WhatsApp",
    },
  };

  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem>({
    id: "1",
    orderNumber: "ZR-1006",
    customerName: isRtl ? "عميلة ١" : "Customer 1",
    city: isRtl ? "[المدينة]" : "[City]",
    total: "--",
    paymentMethod: isRtl ? "الدفع عند الاستلام" : "Cash on Delivery",
    status: "new",
    productName: isRtl ? "طوق شعر مطرز" : "Embroidered Headband",
    quantity: 1,
    productImage: "/categories/hair-accessories1.jpg",
    date: isRtl ? "قبل ساعتين" : "2 hours ago",
  });

  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: "1",
      orderNumber: "ZR-1006",
      customerName: isRtl ? "عميلة ١" : "Customer 1",
      city: isRtl ? "[المدينة]" : "[City]",
      total: "--",
      paymentMethod: isRtl ? "الدفع عند الاستلام" : "Cash on Delivery",
      status: "new",
      productName: isRtl ? "طوق شعر مطرز" : "Embroidered Headband",
      quantity: 1,
      productImage: "/categories/hair-accessories1.jpg",
      date: isRtl ? "قبل ساعتين" : "2 hours ago",
    },
    {
      id: "2",
      orderNumber: "ZR-1005",
      customerName: isRtl ? "عميلة ٢" : "Customer 2",
      city: isRtl ? "[المدينة]" : "[City]",
      total: "--",
      paymentMethod: isRtl ? "الدفع عند الاستلام" : "Cash on Delivery",
      status: "processing",
      productName: isRtl ? "فستان مطرز" : "Embroidered Dress",
      quantity: 1,
      productImage: "/categories/hair-accessories.jpg",
      date: isRtl ? "أمس" : "Yesterday",
    },
    {
      id: "3",
      orderNumber: "ZR-1004",
      customerName: isRtl ? "عميلة ٣" : "Customer 3",
      city: isRtl ? "[المدينة]" : "[City]",
      total: "--",
      paymentMethod: isRtl ? "الدفع عند الاستلام" : "Cash on Delivery",
      status: "shipping",
      productName: isRtl ? "ميدالية مطرزة" : "Embroidered Keychain",
      quantity: 2,
      productImage: "/categories/book.png",
      date: isRtl ? "منذ ٣ أيام" : "3 days ago",
    },
    {
      id: "4",
      orderNumber: "ZR-1003",
      customerName: isRtl ? "عميلة ٤" : "Customer 4",
      city: isRtl ? "[المدينة]" : "[City]",
      total: "--",
      paymentMethod: isRtl ? "الدفع عند الاستلام" : "Cash on Delivery",
      status: "completed",
      productName: isRtl ? "دفتر بغلاف مطرز" : "Embroidered Notebook",
      quantity: 1,
      productImage: "/categories/book.png",
      date: isRtl ? "أسبوع" : "1 week ago",
    },
    {
      id: "5",
      orderNumber: "ZR-1002",
      customerName: isRtl ? "عميلة ٥" : "Customer 5",
      city: isRtl ? "[المدينة]" : "[City]",
      total: "--",
      paymentMethod: isRtl ? "الدفع عند الاستلام" : "Cash on Delivery",
      status: "cancelled",
      productName: isRtl ? "هدية مخصصة" : "Custom Gift",
      quantity: 1,
      productImage: "/categories/hair-accessories1.jpg",
      date: isRtl ? "أسبوعين" : "2 weeks ago",
    },
  ]);

  const [currentStatusSelect, setCurrentStatusSelect] = useState(
    selectedOrder.status,
  );

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

  const handleUpdateStatus = () => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === selectedOrder.id
          ? { ...ord, status: currentStatusSelect }
          : ord,
      ),
    );
    setSelectedOrder((prev) => ({ ...prev, status: currentStatusSelect }));
    alert(
      isRtl ? "تم تحديث حالة الطلب بنجاح" : "Order status updated successfully",
    );
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
        {/* Table & Filters Section */}
        <div className="lg:col-span-8 bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 shadow-xs space-y-5">
          {/* Tabs Filter */}
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
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setCurrentStatusSelect(order.status);
                    }}
                    className={`hover:bg-burgundy/5 transition-colors cursor-pointer ${
                      selectedOrder.id === order.id ? "bg-burgundy/5" : ""
                    }`}
                  >
                    <td className="py-3.5 px-3 font-semibold text-burgundy">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-3 text-brown">
                      {order.customerName}
                    </td>
                    <td className="py-3.5 px-3 text-[#74655f]">{order.city}</td>
                    <td className="py-3.5 px-3 text-center font-medium text-brown">
                      {order.total} د.أ
                    </td>
                    <td className="py-3.5 px-3 text-center text-[#74655f]">
                      {order.paymentMethod}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-medium ${getStatusBadge(order.status)}`}
                      >
                        {t.statusNames[order.status]}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        className="p-1 text-[#887a75] hover:text-burgundy transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Panel */}
        <div className="lg:col-span-4 bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 shadow-xs space-y-6 sticky top-6">
          <div className="border-b border-burgundy/10 pb-4 space-y-1">
            <h2 className="font-amiri text-2xl font-normal text-burgundy">
              {t.details.orderTitle(selectedOrder.orderNumber)}
            </h2>
            <p className="text-[11px] text-[#887a75]">
              {t.details.subtitle(
                t.statusNames[selectedOrder.status],
                selectedOrder.paymentMethod,
              )}
            </p>
          </div>

          <div className="bg-ivory border border-burgundy/10 rounded-[3px] p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-[3px] overflow-hidden bg-beige/40 shrink-0 border border-burgundy/10">
                <Image
                  src={selectedOrder.productImage}
                  alt={selectedOrder.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-sm text-burgundy">
                  {selectedOrder.productName}
                </h4>
                <span className="text-[11px] text-[#887a75]">
                  {t.details.quantity} {selectedOrder.quantity}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-brown">
              {t.details.statusLabel}
            </label>
            <select
              value={currentStatusSelect}
              onChange={(e) =>
                setCurrentStatusSelect(e.target.value as OrderItem["status"])
              }
              className="w-full h-11 px-3 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy cursor-pointer"
            >
              <option value="new">{t.statusNames.new}</option>
              <option value="processing">{t.statusNames.processing}</option>
              <option value="shipping">{t.statusNames.shipping}</option>
              <option value="completed">{t.statusNames.completed}</option>
              <option value="cancelled">{t.statusNames.cancelled}</option>
            </select>

            <button
              type="button"
              onClick={handleUpdateStatus}
              className="w-full h-11 bg-burgundy text-ivory rounded-[3px] text-xs font-medium hover:bg-burgundy/90 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.details.updateBtn}</span>
            </button>

            <a
              href={`https://wa.me/962700000000?text=${encodeURIComponent(`مرحباً ${selectedOrder.customerName}، بخصوص طلبك رقم ${selectedOrder.orderNumber}...`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 bg-[#25D366] text-white rounded-[3px] text-xs font-medium hover:bg-[#20ba5a] transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.details.whatsappBtn}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
