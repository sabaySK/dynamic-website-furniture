import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";

const BlogAdmin = () => {
  const [preTitle, setPreTitle] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    setPreTitle(getOverride("blog.banner.preTitle", ""));
    setTitle(getOverride("blog.banner.title", ""));
  }, []);

  const save = () => {
    setOverrides({
      "blog.banner.preTitle": preTitle,
      "blog.banner.title": title,
    });
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-display font-semibold">Blog Header</h2>
      <input className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm" placeholder="Pre-title" value={preTitle} onChange={(e) => setPreTitle(e.target.value)} />
      <input className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={save} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-body text-sm">Save</button>
    </div>
  );
};

export default BlogAdmin;
