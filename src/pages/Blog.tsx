import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/products";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { getOverride } from "@/lib/overrides";

const Blog = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-card py-16 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary font-body text-sm uppercase tracking-[0.15em] mb-2">
              {getOverride("blog.banner.preTitle", "Stories & Inspiration")}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold">
              {getOverride("blog.banner.title", "The Journal")}
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/blog/${post.id}`} className="group block cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden rounded-xl mb-5">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground font-body mb-3">
                  <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground font-body">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
