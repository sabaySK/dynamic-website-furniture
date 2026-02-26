import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight, Truck, Shield, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { getOverride } from "@/lib/overrides";

const Footer = () => {
  const [email, setEmail] = useState("");

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-2xl font-semibold mb-4">
              NØRD<span className="text-primary">.</span>
            </h3>
            <p className="text-background/60 font-body text-sm leading-relaxed mb-6">
              Crafting timeless furniture with natural materials and Scandinavian design principles since 2018.
            </p>
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

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Shop", "About", "Blog", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="text-background/60 hover:text-primary text-sm font-body transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2">
              {["Living Room", "Bedroom", "Dining", "Office"].map((cat) => (
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

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/60 text-sm font-body">
                <Mail className="h-4 w-4 text-primary" />
                {getOverride("footer.email", "hello@nord-furniture.com")}
              </li>
              <li className="flex items-center gap-2 text-background/60 text-sm font-body">
                <Phone className="h-4 w-4 text-primary" />
                {getOverride("footer.phone", "+1 (555) 123-4567")}
              </li>
              <li className="flex items-center gap-2 text-background/60 text-sm font-body">
                <MapPin className="h-4 w-4 text-primary" />
                {getOverride("footer.location", "Stockholm, Sweden")}
              </li>
            </ul>
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
