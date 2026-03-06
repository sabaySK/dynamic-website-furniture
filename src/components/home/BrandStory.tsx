import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const BrandStory = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-4">
              Our Story
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6">
              Crafted with intention since 2004
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              NØRD began in a small Stockholm workshop with a simple belief: furniture should be
              beautiful, functional, and built to last. We combine Scandinavian design principles
              with sustainable materials and traditional craftsmanship to create pieces that become
              part of your story for generations.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-primary font-body font-medium text-sm hover:underline underline-offset-4"
            >
              Read our full story <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
