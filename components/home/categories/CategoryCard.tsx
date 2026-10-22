"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CategoryCardProps {
  number: string;
  title: string;
  imageSrc: string;
  href: string;
  className?: string;
}

export function CategoryCard({
  number,
  title,
  imageSrc,
  href,
  className = "",
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden block bg-beige/20 ${className}`}
    >
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

      <span className="absolute top-4 end-4 text-white/70 text-[11px] font-tajawal z-10">
        {number}
      </span>

      <div className="absolute bottom-5 inset-x-5 flex items-center justify-between text-white z-10">
        <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 group-hover:bg-burgundy group-hover:text-ivory">
          <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
        </span>

        <h3 className="font-amiri text-2xl md:text-3xl font-normal tracking-wide text-end">
          {title}
        </h3>
      </div>
    </Link>
  );
}