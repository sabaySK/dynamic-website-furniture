import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CtaSection = () => {
  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Design Your Space
          </h2>
          <p className="text-background/60 font-body max-w-md mx-auto mb-8">
            Book a free consultation with our interior design team and bring your vision to life.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-body font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Get in Touch <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
