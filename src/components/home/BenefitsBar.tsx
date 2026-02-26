import { Truck, Shield, Leaf, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  { icon: Truck, title: "Free Shipping", desc: "On all orders over $500" },
  { icon: Shield, title: "5 Year Warranty", desc: "Built to last generations" },
  { icon: Leaf, title: "Sustainable", desc: "FSC certified materials" },
  { icon: Headphones, title: "Expert Support", desc: "Design consultation included" },
];

const BenefitsBar = () => {
  return (
    <section className="border-b border-border bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center py-8 px-4"
            >
              <b.icon className="h-6 w-6 text-primary mb-3" />
              <h4 className="font-display text-sm font-semibold mb-1">{b.title}</h4>
              <p className="text-xs text-muted-foreground font-body">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsBar;
