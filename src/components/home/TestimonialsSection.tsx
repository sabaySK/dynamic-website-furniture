import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { getOverride } from "@/lib/overrides";

type TestimonialItem = {
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
};

const defaultTestimonials: TestimonialItem[] = [
  {
    name: "Anna K.",
    location: "Stockholm, Sweden",
    rating: 5,
    text: "The Nordic Linen Sofa transformed our living room. The craftsmanship is incredible — you can feel the quality the moment you sit down.",
    product: "Nordic Linen Sofa",
  },
  {
    name: "Marcus T.",
    location: "Copenhagen, Denmark",
    rating: 5,
    text: "We ordered the Artisan Dining Table and it's even more beautiful in person. Our family gathers around it every evening now.",
    product: "Artisan Dining Table",
  },
  {
    name: "Sophie L.",
    location: "Oslo, Norway",
    rating: 5,
    text: "Exceptional quality and the design consultation was so helpful. The team helped us furnish our entire apartment in one cohesive style.",
    product: "Full Home Package",
  },
];

function safeParseTestimonials(raw: string): TestimonialItem[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const normalized: TestimonialItem[] = parsed
      .map((t: any) => {
        const rating = Number(t?.rating);
        return {
          name: typeof t?.name === "string" ? t.name : "",
          location: typeof t?.location === "string" ? t.location : "",
          rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, rating)) : 5,
          text: typeof t?.text === "string" ? t.text : "",
          product: typeof t?.product === "string" ? t.product : "",
        };
      })
      .filter((t) => t.text.trim().length > 0);
    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

const TestimonialsSection = () => {
  const overrideItemsRaw = getOverride("index.testimonials.items", "");
  const overrideItems = overrideItemsRaw ? safeParseTestimonials(overrideItemsRaw) : null;
  const testimonials = overrideItems ?? defaultTestimonials;

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
            {getOverride("index.testimonials.preTitle", "Customer Stories")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">
            {getOverride("index.testimonials.title", "Loved by Thousands")}
          </h2>
          <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
            {getOverride("index.testimonials.subtitle", "Hear from real customers who've transformed their spaces with NØRD.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={`${t.name}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative bg-background rounded-xl p-8 shadow-sm border border-border"
            >
              <Quote className="h-8 w-8 text-primary/15 absolute top-6 right-6" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="font-body text-sm text-foreground leading-relaxed mb-5 italic">
                "{t.text}"
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-display text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground font-body">
                  {t.location} · {t.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
