import { useEffect, useState } from "react";
import { Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Loading from "@/components/ui/loading";
import Empty from "@/components/ui/empty";
import PreviewImage from "@/components/ui/preview-image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadImage from "@/components/UploadImage";
import {
  fetchAdminAbout,
  upsertAdminAbout,
  type AdminAboutItem,
} from "@/services/admin-service/about-us/about-us.service";

type AboutFormState = {
  story_title: string;
  title: string;
  content: string;
  story: string;
  mission: string;
  vision: string;
  workshopUrls: string[];
  workshopFiles: File[];
  workshopFilePreviews: string[];
};

const emptyForm: AboutFormState = {
  story_title: "",
  title: "",
  content: "",
  story: "",
  mission: "",
  vision: "",
  workshopUrls: [],
  workshopFiles: [],
  workshopFilePreviews: [],
};

const AboutAdmin = () => {
  const [item, setItem] = useState<AdminAboutItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AboutFormState>(emptyForm);

  useEffect(() => {
    const loadAbout = async () => {
      setLoading(true);
      try {
        const res = await fetchAdminAbout({ suppress401Redirect: true });
        setItem(res);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to fetch about data";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    void loadAbout();
  }, []);

  useEffect(() => {
    return () => {
      form.workshopFilePreviews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [form.workshopFilePreviews]);

  const openUpsertModal = () => {
    const next: AboutFormState = item
      ? {
          story_title: item.story_title ?? "",
          title: item.title ?? "",
          content: item.content ?? "",
          story: item.story ?? "",
          mission: item.mission ?? "",
          vision: item.vision ?? "",
          workshopUrls: [...(item.workshop_image ?? [])],
          workshopFiles: [],
          workshopFilePreviews: [],
        }
      : { ...emptyForm };
    setForm(next);
    setIsFormOpen(true);
  };

  const onPickWorkshopFile = (file: File) => {
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      workshopFiles: [...prev.workshopFiles, file],
      workshopFilePreviews: [...prev.workshopFilePreviews, preview],
    }));
  };

  const removeWorkshopUrl = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      workshopUrls: prev.workshopUrls.filter((_, i) => i !== idx),
    }));
  };

  const removeWorkshopFile = (idx: number) => {
    setForm((prev) => {
      const url = prev.workshopFilePreviews[idx];
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      return {
        ...prev,
        workshopFiles: prev.workshopFiles.filter((_, i) => i !== idx),
        workshopFilePreviews: prev.workshopFilePreviews.filter((_, i) => i !== idx),
      };
    });
  };

  const handleUpsert = async () => {
    setSaving(true);
    try {
      const mergedWorkshopImages = [...form.workshopUrls, ...form.workshopFiles];
      const payload = {
        story_title: form.story_title.trim() || null,
        title: form.title.trim() || null,
        content: form.content.trim() || null,
        story: form.story.trim() || null,
        mission: form.mission.trim() || null,
        vision: form.vision.trim() || null,
        workshop_image: mergedWorkshopImages,
      };

      const res = await upsertAdminAbout(payload, { suppress401Redirect: true });
      setItem(res);
      toast.success(res?.id ? "About updated" : "About saved");
      setIsFormOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save about";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-display font-semibold">About</h3>
              <p className="text-xs text-muted-foreground font-body">API content from `/admin/about`.</p>
            </div>
            <button
              type="button"
              onClick={openUpsertModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
            >
              {item ? "Update About" : "Create About"}
            </button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table className="table-fixed min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Title</TableHead>
                  <TableHead className="w-[20%]">Story Title</TableHead>
                  <TableHead className="w-[45%]">Content</TableHead>
                  <TableHead className="w-[15%]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0">
                      <div className="flex min-h-[180px] items-center justify-center py-8">
                        <Loading size={24} className="text-primary" message="Loading about..." />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !item ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0">
                      <Empty title="No about data found" description="No record was returned from /admin/about." />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={String(item.id)}>
                    <TableCell className="p-2 align-middle">
                      <span className="px-2 py-1.5 text-sm font-body truncate block w-full">{item.title || "—"}</span>
                    </TableCell>
                    <TableCell className="p-2 align-middle">
                      <span className="px-2 py-1.5 text-sm font-body truncate block w-full">{item.story_title || "—"}</span>
                    </TableCell>
                    <TableCell className="p-2 align-middle">
                      <span className="px-2 py-1.5 text-sm font-body truncate block w-full">{item.content || "—"}</span>
                    </TableCell>
                    <TableCell className="p-2 align-middle">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setIsViewOpen(true)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={openUpsertModal}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View About</DialogTitle>
          </DialogHeader>
          {item && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Title</p>
                  <p className="text-sm">{item.title || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Story Title</p>
                  <p className="text-sm">{item.story_title || "—"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Content</p>
                <p className="text-sm">{item.content || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Story</p>
                <p className="text-sm whitespace-pre-line">{item.story || "—"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Mission</p>
                  <p className="text-sm whitespace-pre-line">{item.mission || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vision</p>
                  <p className="text-sm whitespace-pre-line">{item.vision || "—"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Workshop Images ({item.workshop_image?.length ?? 0})
                </p>
                {item.workshop_image && item.workshop_image.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {item.workshop_image.map((src, idx) => (
                      <PreviewImage key={`${src}-${idx}`} src={src} alt={`Workshop ${idx + 1}`} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No workshop images</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => setIsViewOpen(false)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            form.workshopFilePreviews.forEach((url) => {
              if (url.startsWith("blob:")) URL.revokeObjectURL(url);
            });
          }
          setIsFormOpen(open);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{item ? "Update About" : "Create About"}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="tab-1" className="py-2">
            <TabsList className="grid w-full grid-cols-3 bg-muted/60">
              <TabsTrigger value="tab-1">Basic Content</TabsTrigger>
              <TabsTrigger value="tab-2">Story & Values</TabsTrigger>
              <TabsTrigger value="tab-3">Workshop Images</TabsTrigger>
            </TabsList>

            <TabsContent value="tab-1" className="mt-4">
              <div className="rounded-xl border border-border bg-background/60 p-4 grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-body font-medium">Title</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="About Us"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-body font-medium">Story Title</label>
                    <input
                      value={form.story_title}
                      onChange={(e) => setForm((prev) => ({ ...prev, story_title: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="Company Story"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-body font-medium">Content</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                    rows={3}
                    placeholder="Born in Stockholm. Designed for the World."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tab-2" className="mt-4">
              <div className="rounded-xl border border-border bg-background/60 p-4 grid gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-body font-medium">Story</label>
                  <textarea
                    value={form.story}
                    onChange={(e) => setForm((prev) => ({ ...prev, story: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                    rows={5}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-body font-medium">Mission</label>
                    <textarea
                      value={form.mission}
                      onChange={(e) => setForm((prev) => ({ ...prev, mission: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-body font-medium">Vision</label>
                    <textarea
                      value={form.vision}
                      onChange={(e) => setForm((prev) => ({ ...prev, vision: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tab-3" className="mt-4">
              <div className="rounded-xl border border-border bg-background/60 p-4 space-y-4">
                <div>
                  <label className="text-xs font-body font-medium">Workshop Images</label>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Upload workshop images one by one. Uploaded files will be used by backend as workshop images.
                  </p>
                </div>
                {form.workshopUrls.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {form.workshopUrls.map((src, idx) => (
                      <div key={`${src}-${idx}`} className="space-y-1">
                        <PreviewImage src={src} alt={`Workshop URL ${idx + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeWorkshopUrl(idx)}
                          className="w-full rounded border border-border px-2 py-1 text-xs hover:bg-muted/50"
                        >
                          Remove URL
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
                {form.workshopFilePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {form.workshopFilePreviews.map((src, idx) => (
                      <div key={`${src}-${idx}`} className="space-y-1">
                        <PreviewImage src={src} alt={`Workshop file ${idx + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeWorkshopFile(idx)}
                          className="w-full rounded border border-border px-2 py-1 text-xs hover:bg-muted/50"
                        >
                          Remove File
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
                <UploadImage
                  label="Add Workshop Image"
                  previewUrl={null}
                  onFileSelect={onPickWorkshopFile}
                  disabled={saving}
                  className="mt-1"
                />
                <p className="text-[11px] text-muted-foreground">
                  Repeat upload to add more images.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <button
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpsert}
              disabled={saving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : item ? "Update" : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AboutAdmin;
