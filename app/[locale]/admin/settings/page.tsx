"use client";

import { useState, useEffect, use, type FormEvent } from "react";
import { Settings, Store, Truck, Lock, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface SettingsPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

interface SiteSettingRecord {
  key: string;
  value: string;
}

export default function AdminSettingsPage({ params }: SettingsPageProps) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isRtl = locale === "ar";
  const supabase = createClient();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [settings, setSettings] = useState({
    storeName: "زركشة | Zarkasha",
    whatsapp: "0592749393",
    instagram: "@zarkasha",
    adminEmail: "zarkasha.303@gmail.com",
    newPassword: "",
    shippingWestBank: "2",
    shippingJerusalem: "5",
    shippingInside: "3",
    acceptingOrders: true,
    showFeatured: true,
    emailNotification: true,
    maintenanceMode: false,
  });

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase.from("site_settings").select("*");

      if (error) {
        toast.error(isRtl ? "فشل تحميل الإعدادات" : "Failed to load settings");
      } else if (data) {
        const fetchedData = data as SiteSettingRecord[];
        const newSettings: Partial<typeof settings> = {};

        fetchedData.forEach((item) => {
          if (item.key === "store_name") newSettings.storeName = item.value;
          if (item.key === "whatsapp") newSettings.whatsapp = item.value;
          if (item.key === "instagram") newSettings.instagram = item.value;
          if (item.key === "admin_email") newSettings.adminEmail = item.value;
          if (item.key === "shipping_west_bank")
            newSettings.shippingWestBank = item.value;
          if (item.key === "shipping_jerusalem")
            newSettings.shippingJerusalem = item.value;
          if (item.key === "shipping_inside")
            newSettings.shippingInside = item.value;
          if (item.key === "accepting_orders")
            newSettings.acceptingOrders = item.value === "true";
          if (item.key === "show_featured")
            newSettings.showFeatured = item.value === "true";
          if (item.key === "email_notification")
            newSettings.emailNotification = item.value === "true";
          if (item.key === "maintenance_mode")
            newSettings.maintenanceMode = item.value === "true";
        });

        setSettings((prev) => ({ ...prev, ...newSettings }));
      }
      setLoading(false);
    }

    fetchSettings();
  }, [supabase, isRtl]);

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

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const payload = [
      { key: "store_name", value: settings.storeName },
      { key: "whatsapp", value: settings.whatsapp },
      { key: "instagram", value: settings.instagram },
      { key: "admin_email", value: settings.adminEmail },
      { key: "shipping_west_bank", value: settings.shippingWestBank },
      { key: "shipping_jerusalem", value: settings.shippingJerusalem },
      { key: "shipping_inside", value: settings.shippingInside },
      { key: "accepting_orders", value: String(settings.acceptingOrders) },
      { key: "show_featured", value: String(settings.showFeatured) },
      { key: "email_notification", value: String(settings.emailNotification) },
      { key: "maintenance_mode", value: String(settings.maintenanceMode) },
    ];

    const { error } = await supabase.from("site_settings").upsert(payload);

    if (error) {
      toast.error(isRtl ? "فشل حفظ الإعدادات" : "Failed to save settings", {
        description: error.message,
      });
      setSaving(false);
      return;
    }

    if (settings.newPassword.trim().length >= 6) {
      const { error: pwdError } = await supabase.auth.updateUser({
        password: settings.newPassword,
      });
      if (pwdError) {
        toast.error(
          isRtl ? "فشل تحديث كلمة المرور" : "Failed to update password",
          {
            description: pwdError.message,
          },
        );
        setSaving(false);
        return;
      }
    }

    toast.success(
      isRtl ? "تم حفظ الإعدادات بنجاح!" : "Settings saved successfully!",
    );
    setSettings((prev) => ({ ...prev, newPassword: "" }));
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
      </div>
    );
  }

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
        <div className="space-y-6">
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
                  value={settings.adminEmail}
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

        <div className="space-y-6">
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
                disabled={saving}
                className="w-full h-11 bg-burgundy text-ivory rounded-[3px] text-xs font-medium hover:bg-burgundy/90 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{t.saveChanges}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
