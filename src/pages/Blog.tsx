import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/date-time";
import { getOverride } from "@/lib/overrides";
import postService, { PostItem } from "@/services/post/post.service";

const Blog = () => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await postService.fetchPosts();
        if (mounted) setPosts(res.list);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden">
        <img
          src={getOverride("blog.banner.image", "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop")}
          alt="The Journal"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-primary-foreground/60 font-body text-xs md:text-sm uppercase tracking-[0.4em] mb-4">
              {getOverride("blog.banner.preTitle", "Stories & Inspiration")}
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground leading-tight">
              {getOverride("blog.banner.title", "The Journal")}
            </h1>
            <div className="w-20 h-1 bg-primary mx-auto mt-8 opacity-60" />

          </motion.div>
        </div>
      </section>


      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((p, i) => {
            const postId = p.id;
            const image = p.featured_image ?? "";
            const title = p.title ?? "";
            const author = p.author ?? "";
            const date = p.created_at ?? "";
            const excerpt = p.subtitle ?? (p.content ? String(p.content).slice(0, 140) : "");
            const category = p.slug ?? (Array.isArray(p.tag) ? (p.tag[0] ?? "") : (typeof p.tag === "string" ? p.tag : ""));
            const readTime = (p as any).readTime ?? 0; // show 0 when not provided

            return (
              <motion.article
                key={postId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/blog/${postId}`}
                  className="group block cursor-pointer"
                  onClick={() => {
                    // mark as read when user opens the detail from the list (fire-and-forget)
                    postService.markPostAsRead(postId).catch(() => {});
                  }}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl mb-5">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-body mb-3">
                    <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                      {category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readTime ?? 0}
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {title}
                  </h2>

                  <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4 line-clamp-2">
                    {excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground font-body">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {date ? formatDate(date) : ""}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Blog;
