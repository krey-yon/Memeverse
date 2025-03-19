"use client";

import Footer from "@/components/Footer";
import AboutUs from "@/pages/aboutUs-page";
import HeroPage from "@/pages/hero-page";
import Seperation from "@/pages/seperation";
import TrendingMemes from "@/pages/trending-page";
import WhyChooseUs from "@/pages/why-choose-us";

export default function Home() {
  return (
    <div className="flex flex-col bg-amber-500">
      <HeroPage />
      <Seperation />
      <AboutUs />
      <TrendingMemes />
      <WhyChooseUs />
      <Footer />
    </div>
  );
}
