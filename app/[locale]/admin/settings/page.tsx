"use client";

import { useState, use } from "react";
import { Settings, Store, Truck, Lock, Save } from "lucide-react";

interface SettingsPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export default function AdminSettingsPage({ params }: SettingsPageProps) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isRtl = locale === "ar";

  const t = {
    title: isRtl ? "الإعدادات" : "Settings",
    subtitle: isRtl
      ? "إعدادات المتجر وحساب الأدمن"
      : "Store settings and admin account",
    storeInfo: isRtl ? "معلومات المتجر" : "Store Information",
    storeName: isRtl ? "اسم المتجر" : "Store Name",
    whatsapp: isRtl ? "رقم واتساب" : "WhatsApp Number",
    instagram: isRtl ? "حساب إنستغرام" : "Instagram Account",
    email: isRtl ? "البريد الإلكتروني" : "Email",
    storeOptions: isRtl ? "خيارات المتجر" : "Store Options",
    acceptingOrders: isRtl ? "استقبال الطلبات" : "Accepting Orders",
    showFeatured: isRtl ? "عرض المنتجات النافذة" : "Show Out of Stock Products",
    emailNotification: isRtl
      ? "إشعار بريد عند كل طلب جديد"
      : "Email Notification for New Orders",
    maintenanceMode: isRtl ? "وضع الصيانة" : "Maintenance Mode",
    shippingAndPayment: isRtl ? "التوصيل والدفع" : "Shipping & Payment",
    paymentNote: isRtl ? "الدفع عند الاستلام فقط" : "Cash on delivery only",
    shippingWestBank: isRtl
      ? "رسوم التوصيل - الضفة"
      : "Shipping Fee - West Bank",
    shippingJerusalem: isRtl
      ? "رسوم التوصيل - القدس"
      : "Shipping Fee - Jerusalem",
    shippingInside: isRtl ? "رسوم التوصيل - الداخل" : "Shipping Fee - Inside",
    adminAccount: isRtl ? "حساب الأدمن" : "Admin Account",
    adminEmail: isRtl ? "البريد" : "Email",
    newPassword: isRtl ? "كلمة المرور الجديدة" : "New Password",
    saveChanges: isRtl ? "حفظ التغييرات" : "Save Changes",
  };

  const [settings, setSettings] = useState({
    storeName: "زركشة | Zarkasha",
    whatsapp: "+970...",
    instagram: "@...",
    adminEmail: "admin@...",
    newPassword: "",
    shippingWestBank: "2",
    shippingJerusalem: "5",
    shippingInside: "3",
    acceptingOrders: true,
    showFeatured: true,
    emailNotification: true,
    maintenanceMode: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isRtl ? "تم حفظ الإعدادات بنجاح!" : "Settings saved successfully!");
  };

  return (
    <div className="space-y-6 font-tajawal max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="font-amiri text-3xl font-normal text-burgundy">
          {t.title}
        </h1>
        <p className="text-xs text-[#887a75] mt-1">{t.subtitle}</p>
      </div>

      <form
        onSubmit={handleSave}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Left Column: Store Info & Shipping */}
        <div className="space-y-6">
          {/* Store Information */}
          <div className="bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 shadow-xs space-y-4">
            <h2 className="font-amiri text-xl text-burgundy border-b border-burgundy/10 pb-3 flex items-center gap-2">
              <Store className="w-4 h-4 text-olive" />
              <span>{t.storeInfo}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brown">
                  {t.storeName}
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) =>
                    setSettings({ ...settings, storeName: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brown">
                  {t.whatsapp}
                </label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsapp: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy ltr:text-left"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brown">
                  {t.email}
                </label>
                <input
                  type="text"
                  value="hello@..."
                  disabled
                  className="w-full h-10 px-3 bg-ivory/60 border border-burgundy/10 rounded-[3px] text-xs text-[#887a75] outline-none cursor-not-allowed ltr:text-left"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brown">
                  {t.instagram}
                </label>
                <input
                  type="text"
                  value={settings.instagram}
                  onChange={(e) =>
                    setSettings({ ...settings, instagram: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy ltr:text-left"
                />
              </div>
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 shadow-xs space-y-4">
            <div className="border-b border-burgundy/10 pb-3 flex items-center justify-between">
              <h2 className="font-amiri text-xl text-burgundy flex items-center gap-2">
                <Truck className="w-4 h-4 text-olive" />
                <span>{t.shippingAndPayment}</span>
              </h2>
              <span className="text-[10px] text-olive font-medium bg-olive/10 px-2 py-0.5 rounded-[2px]">
                {t.paymentNote}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brown">
                  {t.shippingWestBank}
                </label>
                <input
                  type="text"
                  value={settings.shippingWestBank}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shippingWestBank: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brown">
                  {t.shippingJerusalem}
                </label>
                <input
                  type="text"
                  value={settings.shippingJerusalem}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shippingJerusalem: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brown">
                {t.shippingInside}
              </label>
              <input
                type="text"
                value={settings.shippingInside}
                onChange={(e) =>
                  setSettings({ ...settings, shippingInside: e.target.value })
                }
                className="w-full h-10 px-3 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Store Options & Admin Account */}
        <div className="space-y-6">
          {/* Store Options (Toggles) */}
          <div className="bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 shadow-xs space-y-5">
            <h2 className="font-amiri text-xl text-burgundy border-b border-burgundy/10 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-olive" />
              <span>{t.storeOptions}</span>
            </h2>

            {[
              {
                key: "acceptingOrders",
                label: t.acceptingOrders,
                state: settings.acceptingOrders,
              },
              {
                key: "showFeatured",
                label: t.showFeatured,
                state: settings.showFeatured,
              },
              {
                key: "emailNotification",
                label: t.emailNotification,
                state: settings.emailNotification,
              },
              {
                key: "maintenanceMode",
                label: t.maintenanceMode,
                state: settings.maintenanceMode,
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-1"
              >
                <span className="text-xs font-medium text-brown">
                  {item.label}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleToggle(item.key as keyof typeof settings)
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    item.state ? "bg-olive" : "bg-[#c8beba]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-ivory shadow-xs ring-0 transition duration-200 ease-in-out ${
                      item.state
                        ? isRtl
                          ? "-translate-x-5"
                          : "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Admin Account */}
          <div className="bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 shadow-xs space-y-4">
            <h2 className="font-amiri text-xl text-burgundy border-b border-burgundy/10 pb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-olive" />
              <span>{t.adminAccount}</span>
            </h2>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brown">
                {t.adminEmail}
              </label>
              <input
                type="text"
                value={settings.adminEmail}
                onChange={(e) =>
                  setSettings({ ...settings, adminEmail: e.target.value })
                }
                className="w-full h-10 px-3 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy ltr:text-left"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brown">
                {t.newPassword}
              </label>
              <input
                type="password"
                value={settings.newPassword}
                onChange={(e) =>
                  setSettings({ ...settings, newPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full h-10 px-3 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-11 bg-burgundy text-ivory rounded-[3px] text-xs font-medium hover:bg-burgundy/90 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t.saveChanges}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
