"use client";

import { useState, use } from "react";
import { MessageCircle, Users, ShoppingBag, Phone, MapPin } from "lucide-react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: "vip" | "regular" | "new";
}

interface CustomersPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export default function AdminCustomersPage({ params }: CustomersPageProps) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isRtl = locale === "ar";

  const [customers] = useState<CustomerItem[]>([
    {
      id: "1",
      name: isRtl ? "سارة أحمد" : "Sarah Ahmed",
      email: "sara@example.com",
      phone: "+970599000001",
      city: isRtl ? "القدس" : "Jerusalem",
      totalOrders: 5,
      totalSpent: 180,
      status: "vip",
    },
    {
      id: "2",
      name: isRtl ? "ريم خالد" : "Reem Khaled",
      email: "reem@example.com",
      phone: "+970599000002",
      city: isRtl ? "رام الله" : "Ramallah",
      totalOrders: 2,
      totalSpent: 55,
      status: "regular",
    },
    {
      id: "3",
      name: isRtl ? "منى القاسم" : "Mona Al-Qasim",
      email: "mona@example.com",
      phone: "+970599000003",
      city: isRtl ? "نابلس" : "Nablus",
      totalOrders: 1,
      totalSpent: 25,
      status: "new",
    },
  ]);

  const columns = [
    {
      header: isRtl ? "العميلة" : "Customer",
      accessor: (item: CustomerItem) => (
        <div>
          <span className="font-semibold text-burgundy block text-xs">
            {item.name}
          </span>
          <span className="text-[10px] text-[#887a75]">{item.email}</span>
        </div>
      ),
    },
    {
      header: isRtl ? "المدينة" : "City",
      accessor: (item: CustomerItem) => (
        <span className="text-[#74655f] flex items-center gap-1">
          <MapPin className="w-3 h-3 text-olive" />
          <span>{item.city}</span>
        </span>
      ),
    },
    {
      header: isRtl ? "عدد الطلبات" : "Total Orders",
      className: "text-center",
      accessor: (item: CustomerItem) => (
        <span className="font-medium text-brown flex items-center justify-center gap-1">
          <ShoppingBag className="w-3 h-3 text-[#887a75]" />
          <span>{item.totalOrders}</span>
        </span>
      ),
    },
    {
      header: isRtl ? "إجمالي المشتريات" : "Total Spent",
      className: "text-center",
      accessor: (item: CustomerItem) => (
        <span className="font-semibold text-burgundy">
          {item.totalSpent} {isRtl ? "د.أ" : "JOD"}
        </span>
      ),
    },
    {
      header: isRtl ? "التواصل" : "Contact",
      className: "text-center",
      accessor: (item: CustomerItem) => (
        <a
          href={`https://wa.me/${item.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 bg-[#25D366] text-white rounded-[2px] text-[10px] font-medium hover:bg-[#20ba5a] transition-colors"
        >
          <MessageCircle className="w-3 h-3" />
          <span>{isRtl ? "واتساب" : "WhatsApp"}</span>
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      <AdminDataTable
        locale={locale}
        title={isRtl ? "إدارة العملاء" : "Customers Management"}
        subtitle={
          isRtl
            ? "سجل العميلات وسجل المشتريات والتواصل السريع"
            : "Customer directory, order history, and contact"
        }
        addButtonText={isRtl ? "عميلة جديدة" : "New Customer"}
        addButtonHref="#"
        searchPlaceholder={
          isRtl
            ? "ابحث عن عميلة بالاسم أو المدينة..."
            : "Search customer by name or city..."
        }
        data={customers}
        columns={columns}
      />
    </div>
  );
}
