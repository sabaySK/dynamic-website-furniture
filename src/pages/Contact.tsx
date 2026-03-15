import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import contactBanner from "@/assets/contact-banner.jpg";
import { getOverride } from "@/lib/overrides";
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2032.787729387499!2d18.0686!3d59.3293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9d679c74d4a%3A0x9e0ef4c9a5a5a5a5!2sBirger%20Jarlsgatan%2C%20Stockholm%2C%20Sweden!5e0!3m2!1sen!2sse!4v1709769600000";

type ContactItem = {
  company_name: string;
  phone: string;
  email: string;
  address: string;
  lat: string;
  lang: string;
  social_media: {
    facebook: string;
    instagram: string;
    telegram: string;
  };
  working_hours: string;
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const getContacts = (): ContactItem[] => {
    const raw = getOverride("admin.contact.items", "");
    try {
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error parsing contact items:", e);
    }
    
    return [{
      company_name: "NORD Showroom",
      phone: "+1 (555) 123-4567",
      email: "hello@nord-furniture.com",
      address: "Birger Jarlsgatan 12, 114 34 Stockholm, Sweden",
      lat: "59.3293",
      lang: "18.0686",
      social_media: {
        facebook: "https://facebook.com/nord",
        instagram: "https://instagram.com/nord",
        telegram: "https://t.me/nord"
      },
      working_hours: "Mon-Sat 10:00-18:00"
    }];
  };

  const contacts = getContacts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  const mainContact = contacts[0];

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
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
            <h2 className="font-display text-2xl font-semibold mb-6">Contact Information</h2>
            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-8">
              Reach out to us through any of our branches or social channels. We typically respond within 24 hours.
            </p>

            <div className="space-y-6">
              {contacts.map((contact, idx) => (
                <div key={idx} className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                    <h4 className="font-display text-base font-semibold text-primary">{contact.company_name}</h4>
                    <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      {contact.working_hours || "Open Hours"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium uppercase text-muted-foreground mb-1">Address</p>
                        <p className="text-sm font-body">{contact.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium uppercase text-muted-foreground mb-1">Email</p>
                        <a href={`mailto:${contact.email}`} className="text-sm font-body hover:text-primary transition-colors">{contact.email}</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium uppercase text-muted-foreground mb-1">Phone</p>
                        <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-sm font-body hover:text-primary transition-colors">{contact.phone}</a>
                      </div>
                    </div>

                    {(contact.social_media.facebook || contact.social_media.instagram || contact.social_media.telegram) && (
                      <div className="flex items-start gap-4">
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                           <span className="text-primary font-bold">@</span>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase text-muted-foreground mb-1">Social Media</p>
                          <div className="flex gap-3 mt-1">
                            {contact.social_media.facebook && (
                              <a href={contact.social_media.facebook} target="_blank" rel="noopener noreferrer" className="text-xs font-body hover:text-primary transition-colors">Facebook</a>
                            )}
                            {contact.social_media.instagram && (
                              <a href={contact.social_media.instagram} target="_blank" rel="noopener noreferrer" className="text-xs font-body hover:text-primary transition-colors">Instagram</a>
                            )}
                            {contact.social_media.telegram && (
                              <a href={contact.social_media.telegram} target="_blank" rel="noopener noreferrer" className="text-xs font-body hover:text-primary transition-colors">Telegram</a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
