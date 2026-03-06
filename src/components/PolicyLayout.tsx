import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const PolicyLayout = ({ title, lastUpdated, children }: PolicyLayoutProps) => {
  return (
    <div className="min-h-screen">
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            to="/account?tab=policies"
            className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Policies
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-semibold">{title}</h1>
            <p className="text-muted-foreground font-body text-sm mt-2">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert font-body text-foreground"
        >
          <div className="space-y-8 text-muted-foreground leading-relaxed">
            {children}
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default PolicyLayout;
