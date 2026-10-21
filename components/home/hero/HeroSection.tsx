"use client";

import { HeroContent } from "./HeroContent";
import { HeroImages } from "./HeroImages";

interface HeroSectionProps {
  dict: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    signatureTitle: string;
    signatureSubtitle: string;
    signatureChart: string;
  };
}

export function HeroSection({ dict }: HeroSectionProps) {
  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="min-h-[calc(100vh-128px)] grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] bg-soft-blush overflow-hidden"
      id="home"
    >
      <HeroContent
        dict={dict}
        onExplore={() => handleScroll("categories")}
        onStory={() => handleScroll("story")}
      />
      <HeroImages />
    </section>
  );
}
