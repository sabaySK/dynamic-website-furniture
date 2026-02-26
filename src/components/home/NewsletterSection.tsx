import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setSubmitted(true);
    toast.success("You're in! Check your inbox for a welcome gift.");
    setEmail("");
  };

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3">
            Join the NØRD Family
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-8">
            Get 10% off your first order, early access to new collections, and design inspiration delivered weekly.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-secondary font-body font-medium">
              <CheckCircle className="h-5 w-5" />
              <span>Welcome to the family!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-background border border-border rounded-lg px-4 py-3 font-body text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                maxLength={255}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body font-medium text-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          <p className="text-xs text-muted-foreground font-body mt-4">
            No spam. Unsubscribe anytime. We respect your inbox.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
