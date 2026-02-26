import HeroSection from "@/components/home/HeroSection";
import BenefitsBar from "@/components/home/BenefitsBar";
import BrandTrust from "@/components/home/BrandTrust";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PromoSection from "@/components/home/PromoSection";
import NewArrivals from "@/components/home/NewArrivals";
import NewsletterSection from "@/components/home/NewsletterSection";
import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BenefitsBar />
      <BrandTrust />
      <FeaturedProducts />
      <TestimonialsSection />
      <PromoSection />
      <NewArrivals />
      <NewsletterSection />
      <CtaSection />
    </div>
  );
};

export default Index;
