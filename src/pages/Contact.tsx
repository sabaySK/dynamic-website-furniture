import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import contactBanner from "@/assets/contact-banner.jpg";
import { getOverride } from "@/lib/overrides";
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2032.787729387499!2d18.0686!3d59.3293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9d679c74d4a%3A0x9e0ef4c9a5a5a5a5!2sBirger%20Jarlsgatan%2C%20Stockholm%2C%20Sweden!5e0!3m2!1sen!2sse!4v1709769600000";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      {/* Banner Header */}
      <section className="relative h-[45vh] md:h-[55vh] overflow-hidden">
        <img
          src={getOverride("contact.banner.image", contactBanner)}
          alt="Nord Furniture showroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
              {getOverride("contact.banner.preTitle", "We'd Love to Hear From You")}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold">
              {getOverride("contact.banner.title", "Contact Us")}
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl font-semibold mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-body text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Your name"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                  placeholder="you@example.com"
                  maxLength={255}
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your project..."
                  maxLength={1000}
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-body font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl font-semibold mb-6">Visit Our Showroom</h2>
            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-8">
              Come experience our furniture in person. Our Stockholm showroom is open Monday to Saturday,
              10am – 6pm. Private consultations available by appointment.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold mb-1">Address</h4>
                  <a
                    href="https://www.google.com/maps/search/Birger+Jarlsgatan+12+Stockholm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground font-body text-sm hover:text-primary transition-colors"
                  >
                    {getOverride("contact.address.line1", "Birger Jarlsgatan 12")}<br />
                    {getOverride("contact.address.line2", "114 34 Stockholm, Sweden")}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold mb-1">Email</h4>
                  <a
                    href={`mailto:${getOverride("contact.email", "hello@nord-furniture.com")}`}
                    className="text-muted-foreground font-body text-sm hover:text-primary transition-colors"
                  >
                    {getOverride("contact.email", "hello@nord-furniture.com")}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold mb-1">Phone</h4>
                  <a
                    href={`tel:${getOverride("contact.phone", "+15551234567").replace(/\s/g, "")}`}
                    className="text-muted-foreground font-body text-sm hover:text-primary transition-colors"
                  >
                    {getOverride("contact.phone", "+1 (555) 123-4567")}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <h2 className="font-display text-2xl font-semibold mb-6">Find Us</h2>
          <div className="rounded-xl overflow-hidden border border-border aspect-video w-full">
            <iframe
              title="NØRD Showroom Location"
              src={MAP_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[300px]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
