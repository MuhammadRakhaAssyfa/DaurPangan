import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ImpactSection } from "@/components/landing/ImpactSection";
import { FeaturedListings } from "@/components/landing/FeaturedListings";
import { CtaSection } from "@/components/landing/CtaSection";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <ImpactSection />
        <FeaturedListings />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
