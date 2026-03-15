import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, Eye, Upload, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import aboutImage from "@/assets/about-workshop.jpg";

type AboutItem = {
  title: string;
  content: string;
  story: string;
  mission: string;
  vision: string;
  image: string; // Banner Image
  mission_icon: string;
  workshop_images: string[];
};


const defaultAbout: AboutItem[] = [
  {
    title: "Our Story",
    content: "Made with Purpose",
    story: "NØRD was founded in 2018 with a simple belief: furniture should be honest. Honest materials, honest craftsmanship, honest design. We work directly with skilled artisans across Scandinavia to create pieces that are both beautiful and built to last generations.",
    mission: "To create furniture that lasts generations—beautiful, honest, and made with care. We believe every home deserves pieces that tell a story and age with grace.",
    vision: "By working directly with artisans and using sustainable materials, we bring Scandinavian craftsmanship to the world while protecting the planet for future generations.",
    image: aboutImage,
    mission_icon: "",
    workshop_images: [],
  }
];


function safeParseAbout(raw: string): AboutItem[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map((it: any) => ({
      title: it?.title || "",
      content: it?.content || "",
      story: it?.story || "",
      mission: it?.mission || "",
      vision: it?.vision || "",
      image: it?.image || aboutImage,
      mission_icon: it?.mission_icon || "",
      workshop_images: Array.isArray(it?.workshop_images) ? it.workshop_images : [],
    }));

  } catch {
    return null;
  }
}

const AboutAdmin = () => {
  const [items, setItems] = useState<AboutItem[]>(defaultAbout);
  const [saving, setSaving] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const [newItem, setNewItem] = useState<AboutItem>({
    title: "",
    content: "",
    story: "",
    mission: "",
    vision: "",
    image: aboutImage,
    mission_icon: "",
    workshop_images: [],
  });



  const [editingItem, setEditingItem] = useState<AboutItem | null>(null);
  const [viewingItem, setViewingItem] = useState<AboutItem | null>(null);

  useEffect(() => {
    const raw = getOverride("about.data.items", "");
    const parsed = raw ? safeParseAbout(raw) : null;
    setItems(parsed ?? defaultAbout);
  }, []);

  const handleImageUpload = (file: File | null, isNew: boolean, type: "banner" | "mission" | "workshop") => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (isNew) {
        if (type === "banner") setNewItem(prev => ({ ...prev, image: result }));
        else if (type === "mission") setNewItem(prev => ({ ...prev, mission_icon: result }));
        else setNewItem(prev => ({ ...prev, workshop_images: [...prev.workshop_images, result] }));
      } else if (editingItem) {
        if (type === "banner") setEditingItem({ ...editingItem, image: result });
        else if (type === "mission") setEditingItem({ ...editingItem, mission_icon: result });
        else setEditingItem({ ...editingItem, workshop_images: [...editingItem.workshop_images, result] });
      }
    };
    reader.readAsDataURL(file);
  };


  const removeWorkshopImage = (idx: number, isNew: boolean) => {
    if (isNew) {
      setNewItem(prev => ({ ...prev, workshop_images: prev.workshop_images.filter((_, i) => i !== idx) }));
    } else if (editingItem) {
      setEditingItem({ ...editingItem, workshop_images: editingItem.workshop_images.filter((_, i) => i !== idx) });
    }
  };

  const handleAddSubmit = () => {
    if (!newItem.title.trim() || !newItem.content.trim()) {
      toast.error("Title and Content are required.");
      return;
    }
    setItems(prev => [...prev, newItem]);
    setNewItem({
      title: "",
      content: "",
      story: "",
      mission: "",
      vision: "",
      image: aboutImage,
      mission_icon: "",
      workshop_images: [],
    });

    setIsAddOpen(false);
  };

  const handleEditSubmit = () => {
    if (selectedIdx === null || !editingItem) return;
    setItems(prev => prev.map((it, i) => (i === selectedIdx ? editingItem : it)));
    setIsEditOpen(false);
  };

  const openEdit = (idx: number) => {
    setSelectedIdx(idx);
    setEditingItem({ ...items[idx] });
    setIsEditOpen(true);
  };

  const openView = (idx: number) => {
    setViewingItem(items[idx]);
    setIsViewOpen(true);
  };

  const removeItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const save = () => {
    setSaving(true);
    // Compatibility: Also set individual overrides for the first item
    if (items.length > 0) {
      const main = items[0];
      setOverrides({
        "about.data.items": JSON.stringify(items),
        "about.banner.preTitle": main.title,
        "about.banner.title": main.content,
        "about.story.content": main.story,
        "about.mission.content": main.mission,
        "about.mission.icon": main.mission_icon,
        "about.vision.content": main.vision,
        "about.banner.image": main.image,
        "about.workshop.images": JSON.stringify(main.workshop_images),
      });

    } else {
      setOverrides({ "about.data.items": "[]" });
    }

    setTimeout(() => {
      setSaving(false);
      toast.success("About sections updated");
    }, 600);
  };

  const FormFields = ({ data, setData, isNew }: { data: AboutItem, setData: (d: AboutItem) => void, isNew: boolean }) => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-body font-medium">Banner Pre-Title*</label>
          <input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
            placeholder="Our Story"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-body font-medium">Banner Title*</label>
          <input
            value={data.content}
            onChange={(e) => setData({ ...data, content: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
            placeholder="Made with Purpose"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-body font-medium">Company Story</label>
        <textarea
          value={data.story}
          onChange={(e) => setData({ ...data, story: e.target.value })}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-body font-medium">Mission</label>
          <textarea
            value={data.mission}
            onChange={(e) => setData({ ...data, mission: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-body font-medium">Vision</label>
          <textarea
            value={data.vision}
            onChange={(e) => setData({ ...data, vision: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
            rows={2}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-body font-medium">Our Mission Icon</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null, isNew, "mission")}
              className="block w-full text-sm flex-1 bg-background border border-border rounded-lg px-3 py-2"
            />
            {data.mission_icon && (
              <img src={data.mission_icon} alt="Preview" className="h-10 w-10 rounded border border-border object-cover" />
            )}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-body font-medium">Workshop Gallery</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {data.workshop_images.map((img, idx) => (
            <div key={idx} className="relative h-12 w-12 rounded border border-border overflow-hidden">
              <img src={img} className="h-full w-full object-cover" />
              <button
                onClick={() => removeWorkshopImage(idx, isNew)}
                className="absolute top-0 right-0 bg-red-500 text-white p-0.5"
              >
                <X className="h-2 w-2" />
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            files.forEach(f => handleImageUpload(f, isNew, "workshop"));
          }}

          className="block w-full text-sm bg-background border border-border rounded-lg px-3 py-2"
        />
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-display font-semibold">About Sections</h3>
              <p className="text-xs text-muted-foreground font-body">Manage page content records.</p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors">
                    <Plus className="h-4 w-4" />
                    Add Section
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader><DialogTitle>Create About Section</DialogTitle></DialogHeader>
                  <FormFields data={newItem} setData={setNewItem} isNew={true} />
                  <DialogFooter>
                    <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-body">Cancel</button>
                    <button onClick={handleAddSubmit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body">Save</button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table className="table-fixed min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Pre-Title</TableHead>
                  <TableHead className="w-[20%]">Title</TableHead>
                  <TableHead className="w-[45%]">Story Snippet</TableHead>
                  <TableHead className="w-[15%]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="p-2 truncate font-body text-sm px-4">{it.title}</TableCell>
                    <TableCell className="p-2 truncate font-body text-sm px-4">{it.content}</TableCell>
                    <TableCell className="p-2 truncate font-body text-sm px-4">{it.story}</TableCell>
                    <TableCell className="p-2 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openView(idx)} className="p-1.5 hover:bg-muted rounded transition-colors"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                        <button onClick={() => openEdit(idx)} className="p-1.5 hover:bg-muted rounded transition-colors"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                        <button onClick={() => removeItem(idx)} className="p-1.5 hover:bg-red-500/10 rounded transition-colors"><Trash2 className="h-4 w-4 text-red-500" /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit About Section</DialogTitle></DialogHeader>
          {editingItem && <FormFields data={editingItem} setData={setEditingItem} isNew={false} />}
          <DialogFooter>
            <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-body">Cancel</button>
            <button onClick={handleEditSubmit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body">Save Changes</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>View About Section</DialogTitle></DialogHeader>
          {viewingItem && (
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div><p className="text-xs text-muted-foreground">Banner Pre-Title</p><p className="text-sm font-medium">{viewingItem.title}</p></div>
              <div><p className="text-xs text-muted-foreground">Banner Title</p><p className="text-sm font-medium">{viewingItem.content}</p></div>
              <div><p className="text-xs text-muted-foreground">Story</p><p className="text-sm border p-2 rounded bg-muted/30">{viewingItem.story}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted-foreground">Mission</p><p className="text-sm">{viewingItem.mission}</p></div>
                <div><p className="text-xs text-muted-foreground">Vision</p><p className="text-sm">{viewingItem.vision}</p></div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-1">Our Mission Icon</p>
                {viewingItem.mission_icon ? (
                  <img src={viewingItem.mission_icon} className="h-24 w-24 object-contain rounded border" />
                ) : (
                  <div className="h-24 w-24 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground italic">None</div>
                )}
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Workshop Gallery ({viewingItem.workshop_images.length})</p>
                <div className="flex flex-wrap gap-2">
                  {viewingItem.workshop_images.map((img, i) => (
                    <img key={i} src={img} className="h-16 w-16 object-cover rounded border" />
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button onClick={() => setIsViewOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body">Close</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AboutAdmin;
