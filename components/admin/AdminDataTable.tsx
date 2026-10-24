"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit3, Trash2 } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface AdminDataTableProps<T> {
  locale: "ar" | "en";
  title: string;
  subtitle: string;
  addButtonText: string;
  addButtonHref: string;
  searchPlaceholder: string;
  data: T[];
  columns: Column<T>[];
  onSearchChange?: (query: string) => void;
}

export function AdminDataTable<T extends { id: string }>({
  locale,
  title,
  subtitle,
  addButtonText,
  addButtonHref,
  searchPlaceholder,
  data,
  columns,
}: AdminDataTableProps<T>) {
  const isRtl = locale === "ar";

  return (
    <div className="space-y-6 font-tajawal max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-amiri text-3xl font-normal text-burgundy">
            {title}
          </h1>
          <p className="text-xs text-[#887a75] mt-1">{subtitle}</p>
        </div>
      </div>

      <div className="bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={addButtonHref}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-burgundy text-ivory rounded-[3px] text-xs font-medium hover:bg-burgundy/90 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{addButtonText}</span>
          </Link>

          <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={searchPlaceholder}
                className={`w-full h-10 px-3 ${isRtl ? "pr-8" : "pl-8"} bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy placeholder:text-[#a0928d]`}
              />
              <Search
                className={`w-3.5 h-3.5 text-[#a0928d] absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2`}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start border-collapse">
            <thead>
              <tr className="border-b border-burgundy/10 text-[#887a75] font-medium">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`py-3 px-4 font-normal ${col.className || "text-start"}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-burgundy/5">
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-burgundy/2 transition-colors"
                >
                  {columns.map((col, idx) => {
                    const value =
                      typeof col.accessor === "function"
                        ? col.accessor(item)
                        : (item[col.accessor] as React.ReactNode);
                    return (
                      <td
                        key={idx}
                        className={`py-3.5 px-4 ${col.className || "text-start"}`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
