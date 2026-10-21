import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  locale: string;
}

export function Logo({ locale }: LogoProps) {
  return (
    <Link href={`/${locale}`} className="justify-self-center flex items-center">
      <Image
        src="/logo/logo.png"
        alt="Zarkasha Logo"
        width={110}
        height={35}
        priority
        className="object-contain"
      />
    </Link>
  );
}
