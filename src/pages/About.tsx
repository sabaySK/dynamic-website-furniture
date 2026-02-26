import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Users, TreePine, Award, Star, ArrowRight } from "lucide-react";
import aboutImage from "@/assets/about-workshop.jpg";
import { getOverride } from "@/lib/overrides";

const values = [
  {
    icon: Heart,
    title: "Craftsmanship",
    desc: "Every piece is made by skilled artisans using traditional joinery techniques passed down through generations.",
  },
  {
    icon: TreePine,
    title: "Sustainability",
    desc: "We use only FSC-certified wood and eco-friendly finishes. Our factories are powered by 100% renewable energy.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "We partner with local workshops across Scandinavia, supporting small communities and preserving craft traditions.",
  },
];

const certifications = [
  { name: "FSC Certified", desc: "Responsibly sourced wood" },
  { name: "B Corp Pending", desc: "Social & environmental impact" },
  { name: "Carbon Neutral", desc: "Net-zero shipping since 2024" },
  { name: "OEKO-TEX®", desc: "Tested for harmful substances" },
];

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden">
        <img
          src={getOverride("about.banner.image", aboutImage)}
          alt="NØRD workshop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-primary-foreground/70 font-body text-sm uppercase tracking-[0.2em] mb-3">
              {getOverride("about.banner.preTitle", "Our Story")}
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
              {getOverride("about.banner.title", "Made with Purpose")}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-semibold mb-6">
                Born in Stockholm. Designed for the World.
              </h2>
              <p className="text-muted-foreground font-body text-lg leading-relaxed mb-6">
                NØRD was founded in 2018 with a simple belief: furniture should be honest. Honest materials, 
                honest craftsmanship, honest design. We work directly with skilled artisans across Scandinavia 
                to create pieces that are both beautiful and built to last generations.
              </p>
              <p className="text-muted-foreground font-body text-lg leading-relaxed">
                Every product starts as a sketch on paper and ends as a timeless piece in your home. 
                No shortcuts. No compromises. Just thoughtful design that gets better with age.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats - moved above values for trust impact */}
      <section className="py-16 bg-foreground text-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Happy Customers" },
              { value: "50+", label: "Artisan Partners" },
              { value: "4.8", label: "Average Rating", icon: true },
              { value: "100%", label: "Renewable Energy" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <p className="font-display text-4xl font-bold text-primary">
                    {stat.value}
                  </p>
                  {stat.icon && <Star className="h-5 w-5 fill-accent text-accent" />}
                </div>
                <p className="font-body text-sm text-background/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
              What We Believe
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center p-8"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{v.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
              Our Commitments
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Certifications & Standards
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 text-center border border-border"
              >
                <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                <h4 className="font-display text-sm font-semibold mb-1">{cert.name}</h4>
                <p className="text-xs text-muted-foreground font-body">{cert.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-semibold mb-3">
              Ready to Transform Your Space?
            </h2>
            <p className="text-muted-foreground font-body text-sm mb-6 max-w-md mx-auto">
              Browse our collection or book a free design consultation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-body font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-border text-foreground px-8 py-3.5 rounded-lg font-body font-medium text-sm hover:bg-card transition-colors"
              >
                Free Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
