import React from "react";
import Hero from "../components/Hero";
import TrustSection from "../components/TrustSection";
import ProductsOverview from "../components/ProductsOverview";
import Features from "../components/Features";
import Performance from "../components/Performance";
import HowItWorks from "../components/HowItWorks";
import ProductPreview from "../components/ProductPreview";
import Testimonials from "../components/Testimonials";
import PricingPreview from "../components/PricingPreview";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustSection />
      <ProductsOverview />
      <Features />
      <Performance />
      <HowItWorks />
      <ProductPreview />
      <Testimonials />
      <PricingPreview />
      <FAQ limit={5} />
      <FinalCTA />
    </main>
  );
}
