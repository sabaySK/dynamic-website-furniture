import { motion } from "framer-motion";

const pressLogos = [
  { name: "Architectural Digest", abbr: "AD" },
  { name: "Wallpaper*", abbr: "W*" },
  { name: "Elle Décor", abbr: "ED" },
  { name: "Dezeen", abbr: "DZ" },
  { name: "Monocle", abbr: "M" },
];

const BrandTrust = () => {
  return (
    <section className="py-14 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground font-body uppercase tracking-[0.2em] mb-8">
            As Featured In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {pressLogos.map((logo) => (
              <div
                key={logo.name}
                className="text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
                title={logo.name}
              >
                <span className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                  {logo.abbr}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandTrust;
