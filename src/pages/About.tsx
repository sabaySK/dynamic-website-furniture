import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Users, TreePine, Award, Star, ArrowRight, Target, CheckCircle2 } from "lucide-react";
import aboutImage from "@/assets/about-workshop.jpg";
import productSofa from "@/assets/product-sofa.jpg";
import productTable from "@/assets/product-table.jpg";
import productChair from "@/assets/product-chair.jpg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getOverride } from "@/lib/overrides";
import aboutService, { AboutItem } from "@/services/about/about.service";

const workshopPhotosDefault = [
  { src: aboutImage, alt: "Our workshop in Stockholm" },
  { src: productSofa, alt: "Crafting sofas by hand" },
  { src: productTable, alt: "Woodworking at our factory" },
  { src: productChair, alt: "Finishing touches" },
];


const team = [
  { name: "Erik Lindström", role: "Founder & CEO", initials: "EL" },
  { name: "Anna Berg", role: "Head of Design", initials: "AB" },
  { name: "Marcus Holm", role: "Workshop Director", initials: "MH" },
  { name: "Sofia Nilsson", role: "Sustainability Lead", initials: "SN" },
];

const whyChooseUs = [
  "Handcrafted by skilled artisans using traditional techniques",
  "FSC-certified wood and eco-friendly materials only",
  "10-year warranty on all solid wood furniture",
  "Carbon-neutral shipping worldwide",
  "Direct from workshop—no middlemen, fair prices",
  "Free design consultation for large orders",
];

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
  const [about, setAbout] = useState<AboutItem | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await aboutService.fetchAbout();
        if (mounted) setAbout(data);
      } catch (err) {
        console.error("Failed to load about:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  // Prefer API-provided workshop images when available, then admin overrides, then defaults.
  let workshopPhotos = workshopPhotosDefault;

  if (about?.workshop_image && Array.isArray(about.workshop_image) && about.workshop_image.length > 0) {
    workshopPhotos = about.workshop_image.map((src, i) => ({ src, alt: `Workshop photo ${i + 1}` }));
  } else {
    const workshopImagesRaw = getOverride("about.workshop.images", "");
    if (workshopImagesRaw) {
      try {
        const parsed = JSON.parse(workshopImagesRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          workshopPhotos = parsed.map((img, i) => ({ src: img, alt: `Workshop photo ${i + 1}` }));
        }
      } catch (e) {
        // ignore parse errors and keep defaults
      }
    }
  }
  // Prefer API team when available, otherwise fall back to static team
  const teamMembers = (about?.team && Array.isArray(about.team) && about.team.length > 0) ? about.team : team;

  const getInitials = (name?: string, fallback?: string) => {
    if (fallback) return fallback;
    if (!name) return "";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (

    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden">
        <img
          src={about?.image ?? getOverride("about.banner.image", aboutImage)}
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
              {about?.title ?? getOverride("about.banner.preTitle", "Our Story")}
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
              {about?.content ?? getOverride("about.banner.title", "Made with Purpose")}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
              About Us
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">Company Story</h2>
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display text-2xl font-semibold mb-6">
                {about?.story_title ?? "Born in Stockholm. Designed for the World."}
              </h3>
              <p className="text-muted-foreground font-body text-lg leading-relaxed mb-6 whitespace-pre-line">
                {about?.story ?? getOverride("about.story.content", "NØRD was founded in 2018 with a simple belief: furniture should be honest. Honest materials, honest craftsmanship, honest design. We work directly with skilled artisans across Scandinavia to create pieces that are both beautiful and built to last generations.")}
              </p>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                {/*
                  Prefer an API-provided mission icon when available; fall back to override or the default icon.
                  Some APIs return mission icon as `mission_icon` or under a nested object; we try common keys.
                */}
                {about?.mission_icon || (about as any)?.mission?.icon ? (
                  <img
                    src={(about?.mission_icon ?? (about as any).mission?.icon) as string}
                    alt="Mission Icon"
                    className="w-full h-full object-cover"
                  />
                ) : getOverride("about.mission.icon", "") ? (
                  <img src={getOverride("about.mission.icon", "")} alt="Mission Icon" className="w-full h-full object-cover" />
                ) : (
                  <Target className="h-7 w-7 text-primary" />
                )}
              </div>

              <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
                Our Purpose
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6">Our Mission</h2>
              <p className="text-muted-foreground font-body text-lg leading-relaxed whitespace-pre-line">
                {about?.mission ?? getOverride("about.mission.content", "To create furniture that lasts generations—beautiful, honest, and made with care. We believe every home deserves pieces that tell a story and age with grace. By working directly with artisans and using sustainable materials, we bring Scandinavian craftsmanship to the world while protecting the planet for future generations.")}
              </p>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Workshop / Factory Photos */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
              Behind the Scenes
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Workshop & Factory
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {workshopPhotos.map((photo, i) => (
              <motion.div
                key={photo.alt}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl overflow-hidden border border-border aspect-[4/3]"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
              The People Behind NØRD
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">Our Team</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {teamMembers.map((member: any, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <Avatar className="h-20 w-20 mx-auto mb-4 border-2 border-primary/20 overflow-hidden">
                  {((member as any).avatar || (member as any).image) ? (
                    <img src={(member as any).avatar ?? (member as any).image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary font-display font-semibold text-lg">
                      {getInitials(member.name, (member as any).initials)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h3 className="font-display font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground font-body">{(member as any).role ?? (member as any).description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
              The NØRD Difference
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(() => {
              const whyItems = (about?.why_choose && Array.isArray(about.why_choose) && about.why_choose.length > 0)
                ? about.why_choose
                : whyChooseUs;

              return whyItems.map((item: any, i: number) => {
                const content = typeof item === "string" ? item : item.content ?? "";
                const iconUrl = typeof item === "object" ? item.icon : undefined;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
                  >
                    {iconUrl ? (
                      <div className="w-8 h-8 flex-shrink-0 mt-0.5 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                        <img src={iconUrl} alt={`why-choose-${i}`} className="w-5 h-5 object-contain" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 flex-shrink-0 mt-0.5 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <p className="font-body text-sm text-foreground">{content}</p>
                  </motion.div>
                );
              });
            })()}
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
            {(() => {
              const valueItems = (about?.our_values && Array.isArray(about.our_values) && about.our_values.length > 0)
                ? about.our_values
                : values;

              return valueItems.map((v: any, i: number) => {
                const title = v.title ?? v.title;
                const desc = v.description ?? v.desc;
                const iconUrl = typeof v.icon === "string" ? v.icon : undefined;
                const IconComp = typeof v.icon === "function" ? v.icon : undefined;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="text-center p-8"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 overflow-hidden">
                      {iconUrl ? (
                        <img src={iconUrl} alt={`value-${i}`} className="w-8 h-8 object-contain" />
                      ) : IconComp ? (
                        <IconComp className="h-6 w-6 text-primary" />
                      ) : (
                        <Heart className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3">{title}</h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">
                      {desc}
                    </p>
                  </motion.div>
                );
              });
            })()}
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
            {(() => {
              const certItems = (about?.certifications && Array.isArray(about.certifications) && about.certifications.length > 0)
                ? about.certifications
                : certifications.map((c) => ({ title: c.name, description: c.desc }));

              return certItems.map((cert: any, i: number) => {
                const title = cert.title ?? cert.name ?? cert.title;
                const desc = cert.description ?? cert.desc ?? cert.description;
                const iconUrl = cert.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-xl p-6 text-center border border-border"
                  >
                    {iconUrl ? (
                      <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center">
                        <img src={iconUrl} alt={title} className="w-10 h-10 object-contain" />
                      </div>
                    ) : (
                      <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                    )}
                    <h4 className="font-display text-sm font-semibold mb-1">{title}</h4>
                    <p className="text-xs text-muted-foreground font-body">{desc}</p>
                  </motion.div>
                );
              });
            })()}
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
