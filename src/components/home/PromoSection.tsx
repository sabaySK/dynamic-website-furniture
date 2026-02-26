import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const PromoSection = () => {
  return (
    <section className="bg-foreground text-background py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-body text-xs uppercase tracking-[0.2em] text-background/50 mb-4">
              Limited Time Offer
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 italic">
              Winter Sale
            </h2>
            <p className="font-body text-background/70 text-lg mb-8">
              Up to 30% off select pieces. Ends February 28th.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-body font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Shop the Sale <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
