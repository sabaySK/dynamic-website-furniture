import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight, Truck, Shield, RotateCcw, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { toast } from "sonner";
import contactService, { ContactItem as ServiceContactItem } from "@/services/contact/contact.service";
import { formatPhoneNumber, toTelHref } from "@/lib/phone-number";

const CATEGORIES = ["Living Room", "Bedroom", "Dining", "Office", "Lighting", "Storage"];

const CUSTOMER_SERVICE = [
  { label: "Order Status", to: "/account?tab=orders" },
  { label: "Contact Us", to: "/contact" },
  { label: "FAQ", to: "/contact" },
  { label: "Returns & Exchanges", to: "/return-policy" },
];

const POLICIES = [
  { label: "Shipping Policy", to: "/shipping-policy" },
  { label: "Return Policy", to: "/return-policy" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms" },
];

/* removed static social links — footer will use API-provided social_media when available */

const Footer = () => {
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState<ServiceContactItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const c = await contactService.fetchContact({ suppress401Redirect: true });
        const normalized = Array.isArray(c) ? c[0] : c;
        if (mounted) setContact(normalized);
      } catch (err) {
        console.error("Failed to load footer contact:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("You're subscribed!");
    setEmail("");
  };

  return (
    <footer className="bg-foreground text-background">
      {/* Trust badges bar */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-background/10">
            {[
              { icon: Truck, text: "Free Shipping Over $500" },
              { icon: Shield, text: "5 Year Warranty" },
              { icon: RotateCcw, text: "30-Day Free Returns" },
            ].map((item) => (
              <div key={item.text} className="flex items-center justify-center gap-2.5 py-5">
                <item.icon className="h-4 w-4 text-primary" />
                <span className="text-xs font-body font-medium text-background/70">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand + Newsletter */}
          <div className="col-span-2">
            <h3 className="font-display text-2xl font-semibold mb-4">
              NØRD<span className="text-primary">.</span>
            </h3>
            <p className="text-background/60 font-body text-sm leading-relaxed mb-6">
              Crafting timeless furniture with natural materials and Scandinavian design principles since 2018.
            </p>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-3">Newsletter</h4>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 bg-background/10 border border-background/20 rounded-lg px-4 py-2.5 font-body text-sm text-background placeholder:text-background/40 focus:ring-2 focus:ring-primary/30 focus:outline-none transition-colors"
                maxLength={255}
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-body font-medium text-sm hover:bg-primary/90 transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className="text-background/60 hover:text-primary text-sm font-body transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {CUSTOMER_SERVICE.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-background/60 hover:text-primary text-sm font-body transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Policies</h4>
            <ul className="space-y-2">
              {POLICIES.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-background/60 hover:text-primary text-sm font-body transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info + Social Media */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Contact Info</h4>
            <ul className="space-y-3 mb-4">
              {contact?.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-background/60 hover:text-primary text-sm font-body transition-colors"
                  >
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    {contact.email}
                  </a>
                </li>
              )}
              {contact?.phone && (
                <li>
                  <a
                    href={`tel:${toTelHref(contact.phone)}`}
                    className="flex items-center gap-2 text-background/60 hover:text-primary text-sm font-body transition-colors"
                  >
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    {formatPhoneNumber(contact.phone)}
                  </a>
                </li>
              )}
              {contact?.address && (
                <li className="flex items-start gap-2 text-background/60 text-sm font-body">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {contact.address}
                </li>
              )}
            </ul>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-3">Social Media</h4>
            <div className="flex gap-2">
              {contact?.social_media && (
                <>
                  {Object.entries(contact.social_media).map(([key, href]) => {
                    if (!href) return null;
                    const iconUrl = contact?.social_media_icons?.[key];
                    return (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={key}
                        className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors overflow-hidden"
                      >
                        {iconUrl ? (
                          <img src={iconUrl} alt={`${key} icon`} className="w-full h-full object-cover" />
                        ) : (
                          // Fallback to lucide icons
                          (() => {
                            switch (key.toLowerCase()) {
                              case "facebook":
                                return <Facebook className="h-4 w-4" />;
                              case "instagram":
                                return <Instagram className="h-4 w-4" />;
                              case "telegram":
                                return <Twitter className="h-4 w-4" />;
                              default:
                                return <Linkedin className="h-4 w-4" />;
                            }
                          })()
                        )}
                      </a>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-background/40 text-xs font-body">
            © 2026 NØRD Furniture. All rights reserved. Crafted with care.
          </p>
          <div className="flex items-center gap-4 text-background/30 text-xs font-body">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Apple Pay</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
