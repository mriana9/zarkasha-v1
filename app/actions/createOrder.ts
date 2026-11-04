"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface OrderItem {
  id: string;
  quantity: number;
}

interface CreateOrderInput {
  items: OrderItem[];
  fullName: string;
  phone: string;
  address: string;
  region: string;
  notes: string;
  shippingCost: number;
  locale: "ar" | "en";
}

interface CreateOrderResult {
  success: boolean;
  orderNumber?: string;
  totalAmount?: number;
  error?: string;
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  try {
    if (!input.items || input.items.length === 0) {
      return { success: false, error: "EMPTY_CART" };
    }

    if (!/^\d{10}$/.test(input.phone.trim())) {
      return { success: false, error: "INVALID_PHONE" };
    }

    if (!input.fullName.trim() || !input.address.trim()) {
      return { success: false, error: "MISSING_FIELDS" };
    }

    if (
      typeof input.shippingCost !== "number" ||
      input.shippingCost < 0 ||
      input.shippingCost > 1000
    ) {
      return { success: false, error: "INVALID_SHIPPING" };
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch {
              // Called from Server Component
            }
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const productIds = input.items.map((item) => item.id);

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, title_ar, title_en, price, images, is_visible")
      .in("id", productIds)
      .eq("is_visible", true);

    if (productsError || !products || products.length === 0) {
      return { success: false, error: "PRODUCTS_NOT_FOUND" };
    }

    let itemsTotal = 0;
    const resolvedItems = input.items.map((item) => {
      const product = products.find((p) => p.id === item.id);

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      if (item.quantity <= 0 || item.quantity > 100) {
        throw new Error("INVALID_QUANTITY");
      }

      const lineTotal = Number(product.price) * item.quantity;
      itemsTotal += lineTotal;

      return {
        id: product.id,
        title: input.locale === "ar" ? product.title_ar : product.title_en,
        price: Number(product.price),
        quantity: item.quantity,
        image: product.images?.[0] ?? "",
        line_total: lineTotal,
      };
    });

    const finalTotal = itemsTotal + input.shippingCost;

    if (finalTotal <= 0 || finalTotal > 100000) {
      return { success: false, error: "INVALID_TOTAL" };
    }

    const shippingAddress = {
      full_name: input.fullName.trim(),
      phone: input.phone.trim(),
      address: input.address.trim(),
      notes: input.notes.trim(),
      region: input.region,
      shipping_cost: input.shippingCost,
      items: resolvedItems,
    };

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        total_amount: finalTotal,
        shipping_address: shippingAddress,
        payment_method: "cash_on_delivery",
        status: "pending",
        user_id: user?.id ?? null,
      })
      .select("order_number")
      .single();

    if (orderError || !orderData) {
      console.error("Order insert error:", orderError);
      return { success: false, error: "INSERT_FAILED" };
    }

    return {
      success: true,
      orderNumber: orderData.order_number ?? "",
      totalAmount: finalTotal,
    };
  } catch (err) {
    console.error("createOrder error:", err);
    return { success: false, error: "UNEXPECTED" };
  }
}
