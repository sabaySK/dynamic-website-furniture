import HeroSection from "@/components/home/HeroSection";
import BenefitsBar from "@/components/home/BenefitsBar";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ShopByCategory from "@/components/home/ShopByCategory";
import BestSellingProducts from "@/components/home/BestSellingProducts";
import NewArrivals from "@/components/home/NewArrivals";
import PromoSection from "@/components/home/PromoSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BrandStory from "@/components/home/BrandStory";
import NewsletterSection from "@/components/home/NewsletterSection";
import InstagramGallery from "@/components/home/InstagramGallery";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* 1. Hero banner (new collection / promotion) */}
      <HeroSection />
      <BenefitsBar />
      {/* 2. Featured furniture */}
      <FeaturedProducts />
      {/* 3. Shop by category */}
      <ShopByCategory />
      {/* 4. Best selling products */}
      <BestSellingProducts />
      {/* 5. New arrivals */}
      <NewArrivals />
      {/* 6. Promotion / discount banner */}
      <PromoSection />
      {/* 7. Customer testimonials */}
      <TestimonialsSection />
      {/* 8. Brand story short section */}
      <BrandStory />
      {/* 9. Newsletter subscription */}
      <NewsletterSection />
      {/* 10. Instagram / gallery */}
      <InstagramGallery />
    </div>
  );
};

export default Index;
