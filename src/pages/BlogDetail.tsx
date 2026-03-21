import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft, Tag, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/date-time";
import postService, { PostItem } from "@/services/post/post.service";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [otherPosts, setOtherPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        if (id) {
          const p = await postService.fetchPostById(id);
          if (mounted) {
            // map normalized post to UI shape
            const contentStr = p.content ?? "";
            const contentArr = typeof contentStr === "string" ? contentStr.split(/\n\s*\n/) : (Array.isArray(p.content) ? p.content : []);
            const tags = Array.isArray(p.tag) ? p.tag : (p.tag ? [p.tag as string] : []);
            const mapped = {
              id: p.id,
              title: p.title,
              image: p.featured_image,
              slug: p.slug ?? "",
              category: tags[0] ?? "",
              author: p.author,
              authorRole: p.author_role,
              date: p.created_at,
              readTime: p.readTime ?? 0,
              excerpt: p.subtitle ?? (typeof p.content === "string" ? String(p.content).slice(0, 160) : ""),
              content: contentArr,
              tags,
            };
            setPost(mapped);

            // NOTE: do not explicitly mark as read here to avoid double-counting
          }
        }

        const list = await postService.fetchPosts();
        if (mounted) {
          const others = list.list
            .map((p) => ({
              id: p.id,
              title: p.title,
              image: p.featured_image,
              category: p.slug ?? (Array.isArray(p.tag) ? (p.tag[0] ?? "") : (typeof p.tag === "string" ? p.tag : "")),
              excerpt: p.subtitle ?? (typeof p.content === "string" ? String(p.content).slice(0, 120) : ""),
              author: p.author ?? "",
              date: p.created_at ?? "",
              readTime: p.readTime ?? 0,
            }))
            .filter((p) => String(p.id) !== String(id));
          setOtherPosts(others);
        }
      } catch (err) {
        console.error("Failed to load post:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4">Post not found</h1>
          <Link to="/blog" className="text-primary font-body text-sm underline underline-offset-4">
            ← Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Back link */}
        <div className="absolute top-6 left-0 right-0 container mx-auto px-4 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-body bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-foreground hover:bg-background transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 lg:px-8 pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-primary/90 text-primary-foreground text-xs font-body font-medium px-3 py-1 rounded-full mb-3">
              {post.slug ?? post.category}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-semibold text-foreground max-w-3xl leading-tight">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-body mb-10 pb-8 border-b border-border"
          >
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">{post.author}</span>
              <span className="text-muted-foreground">— {post.authorRole}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              {post.readTime ?? 0} read
            </span>
          </motion.div>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-xl md:text-2xl text-foreground/80 leading-relaxed mb-10 italic"
          >
            {post.excerpt}
          </motion.p>

          {/* Body paragraphs */}
          <div className="space-y-6">
            {post.content.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="font-body text-foreground/80 leading-[1.9] text-base md:text-lg"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-border"
          >
            <Tag className="h-4 w-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-body font-medium bg-muted text-muted-foreground px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* More Articles */}
        {otherPosts.length > 0 && (
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="font-display text-2xl font-semibold mb-8">More from the Journal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherPosts.map((related, i) => (
                <motion.article
                  key={related.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/blog/${related.id}`}
                    className="group block cursor-pointer"
                    onClick={() => {
                      // mark related post as read when user navigates to it
                      postService.markPostAsRead(related.id).catch(() => {});
                    }}
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-xl mb-5">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-body mb-3">
                      <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                        {related.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {related.readTime ?? 0}
                      </span>
                    </div>

                    <h2 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {related.title}
                    </h2>

                    <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4 line-clamp-2">
                      {related.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground font-body">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {related.author ?? ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {related.date ? formatDate(related.date) : ""}
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
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
