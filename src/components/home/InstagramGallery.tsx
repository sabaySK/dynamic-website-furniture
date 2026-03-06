import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import productSofa from "@/assets/product-sofa.jpg";
import productChair from "@/assets/product-chair.jpg";
import productDining from "@/assets/product-dining.jpg";
import productTable from "@/assets/product-table.jpg";
import productShelf from "@/assets/product-shelf.jpg";
import productLamp from "@/assets/product-lamp.jpg";

const galleryImages = [
  productSofa,
  productChair,
  productDining,
  productTable,
  productShelf,
  productLamp,
];

const InstagramGallery = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
            Follow Us
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">
            @nord.furniture
          </h2>
          <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
            Daily inspiration, behind-the-scenes, and customer spaces.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {galleryImages.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="aspect-square relative overflow-hidden rounded-lg group"
            >
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                <Instagram className="h-8 w-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramGallery;
