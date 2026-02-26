import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-living-room.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Modern Scandinavian living room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      </div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-xl"
        >
          <p className="text-primary-foreground/70 font-body text-sm uppercase tracking-[0.2em] mb-4">
            New Collection 2026
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6">
            Live with
            <br />
            <span className="italic font-normal">intention.</span>
          </h1>
          <p className="text-primary-foreground/80 font-body text-lg mb-6 max-w-md leading-relaxed">
            Handcrafted furniture that brings warmth, simplicity and beauty into every room.
          </p>

          {/* Social proof micro-stat */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-primary-foreground/70 font-body text-sm">
              Rated 4.8/5 by 10,000+ happy customers
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-body font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-8 py-3.5 rounded-lg font-body font-medium text-sm hover:bg-primary-foreground/10 transition-colors"
            >
              Our Story
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
