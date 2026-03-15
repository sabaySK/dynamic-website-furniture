import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, Eye, FileText, ChevronRight } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PolicySection = {
  title: string;
  content: string;
};

type PolicyData = {
  mainTitle: string;
  lastUpdated: string;
  sections: PolicySection[];
};

const defaultPolicies: Record<string, PolicyData> = {
  shipping: {
    mainTitle: "Shipping Policy",
    lastUpdated: "March 15, 2026",
    sections: [
      { title: "Delivery Options", content: "We offer several shipping options to suit your needs..." },
      { title: "Shipping Areas", content: "We ship throughout Sweden, Norway, Denmark, Finland..." },
    ],
  },
  return: {
    mainTitle: "Return Policy",
    lastUpdated: "March 15, 2026",
    sections: [
      { title: "Returns & Exchanges", content: "We want you to be completely satisfied with your purchase..." },
    ],
  },
  privacy: {
    mainTitle: "Privacy Policy",
    lastUpdated: "March 15, 2026",
    sections: [
      { title: "Information Collection", content: "We collect information you provide directly to us..." },
    ],
  },
  terms: {
    mainTitle: "Terms & Conditions",
    lastUpdated: "March 15, 2026",
    sections: [
      { title: "Usage Terms", content: "By accessing this website, you agree to these terms..." },
    ],
  },
};

const PolicyEditor = ({ type, data, onUpdate }: { type: string; data: PolicyData; onUpdate: (newData: PolicyData) => void }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [newSection, setNewSection] = useState<PolicySection>({ title: "", content: "" });
  const [editingSection, setEditingSection] = useState<PolicySection | null>(null);
  const [viewingSection, setViewingSection] = useState<PolicySection | null>(null);

  const handleAddSubmit = () => {
    if (!newSection.title.trim() || !newSection.content.trim()) {
      toast.error("Please fill in Section Title and Content.");
      return;
    }
    const newData = { ...data, sections: [...data.sections, newSection] };
    onUpdate(newData);
    setNewSection({ title: "", content: "" });
    setIsAddOpen(false);
  };

  const handleEditSubmit = () => {
    if (selectedIdx === null || !editingSection) return;
    if (!editingSection.title.trim() || !editingSection.content.trim()) {
      toast.error("Please fill in Section Title and Content.");
      return;
    }
    const newData = {
      ...data,
      sections: data.sections.map((sec, i) => (i === selectedIdx ? editingSection : sec))
    };
    onUpdate(newData);
    setIsEditOpen(false);
  };

  const removeItem = (index: number) => {
    const newData = { ...data, sections: data.sections.filter((_, i) => i !== index) };
    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Main Page Title</Label>
          <Input 
            value={data.mainTitle} 
            onChange={(e) => onUpdate({ ...data, mainTitle: e.target.value })}
            placeholder="e.g. Shipping Policy"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Last Updated Date</Label>
          <Input 
            value={data.lastUpdated} 
            onChange={(e) => onUpdate({ ...data, lastUpdated: e.target.value })}
            placeholder="e.g. March 15, 2026"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold font-display">Content Sections</h4>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors">
                <Plus className="h-4 w-4" />
                Add Section
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input 
                    value={newSection.title} 
                    onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                    placeholder="e.g. Delivery Options"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea 
                    value={newSection.content} 
                    onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                    placeholder="Enter section content text..."
                    className="min-h-[200px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 border border-border rounded-lg text-sm">Cancel</button>
                <button onClick={handleAddSubmit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Add Section</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Section Title</TableHead>
                <TableHead className="w-[55%]">Content Preview</TableHead>
                <TableHead className="w-[15%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.sections.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground italic">
                    No sections added yet.
                  </TableCell>
                </TableRow>
              )}
              {data.sections.map((sec, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium p-3">{sec.title}</TableCell>
                  <TableCell className="p-3">
                    <p className="line-clamp-1 text-xs text-muted-foreground">{sec.content}</p>
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                         onClick={() => { setViewingSection(sec); setIsViewOpen(true); }}
                         className="p-1.5 hover:bg-muted rounded-md" title="View"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button 
                        onClick={() => { setSelectedIdx(idx); setEditingSection(sec); setIsEditOpen(true); }}
                        className="p-1.5 hover:bg-muted rounded-md" title="Edit"
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button 
                        onClick={() => removeItem(idx)}
                        className="p-1.5 hover:bg-red-500/10 rounded-md group" title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
          </DialogHeader>
          {editingSection && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input 
                  value={editingSection.title} 
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea 
                  value={editingSection.content} 
                  onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                  className="min-h-[200px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 border border-border rounded-lg text-sm">Cancel</button>
            <button onClick={handleEditSubmit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Save Changes</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Section Details</DialogTitle>
          </DialogHeader>
          {viewingSection && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground text-xs uppercase">Title</Label>
                <p className="font-semibold text-lg">{viewingSection.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs uppercase">Content</Label>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{viewingSection.content}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <button onClick={() => setIsViewOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Close</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PoliciesAdmin = () => {
  const [policies, setPolicies] = useState<Record<string, PolicyData>>(defaultPolicies);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const types = ['shipping', 'return', 'privacy', 'terms'];
    const loadedPolicies = { ...defaultPolicies };
    
    types.forEach(type => {
      const stored = getOverride(`policies.${type}.data`, "");
      if (stored) {
        try {
          loadedPolicies[type] = JSON.parse(stored);
        } catch (e) {
          console.error(`Failed to parse ${type} policy`, e);
        }
      }
    });
    
    setPolicies(loadedPolicies);
  }, []);

  const save = () => {
    setSaving(true);
    const overrides: Record<string, string> = {};
    Object.entries(policies).forEach(([type, data]) => {
      overrides[`policies.${type}.data`] = JSON.stringify(data);
    });
    
    setOverrides(overrides);
    
    setTimeout(() => {
      setSaving(false);
      toast.success("All policies updated successfully");
    }, 800);
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Policy Management
            </h2>
            <p className="text-sm text-muted-foreground font-body">Update and manage your website policies and legal terms.</p>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 shadow-md shadow-primary/20"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save All Changes"}
          </button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="shipping" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 h-auto p-1 bg-muted/50 rounded-lg">
              <TabsTrigger value="shipping" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Shipping</TabsTrigger>
              <TabsTrigger value="return" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Return</TabsTrigger>
              <TabsTrigger value="privacy" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Privacy</TabsTrigger>
              <TabsTrigger value="terms" className="py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Terms</TabsTrigger>
            </TabsList>

            <TabsContent value="shipping" className="mt-0 focus-visible:outline-none">
              <PolicyEditor 
                type="shipping" 
                data={policies.shipping} 
                onUpdate={(newData) => setPolicies(prev => ({ ...prev, shipping: newData }))} 
              />
            </TabsContent>

            <TabsContent value="return" className="mt-0 focus-visible:outline-none">
              <PolicyEditor 
                type="return" 
                data={policies.return} 
                onUpdate={(newData) => setPolicies(prev => ({ ...prev, return: newData }))} 
              />
            </TabsContent>

            <TabsContent value="privacy" className="mt-0 focus-visible:outline-none">
              <PolicyEditor 
                type="privacy" 
                data={policies.privacy} 
                onUpdate={(newData) => setPolicies(prev => ({ ...prev, privacy: newData }))} 
              />
            </TabsContent>

            <TabsContent value="terms" className="mt-0 focus-visible:outline-none">
              <PolicyEditor 
                type="terms" 
                data={policies.terms} 
                onUpdate={(newData) => setPolicies(prev => ({ ...prev, terms: newData }))} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 flex items-start gap-3">
        <div className="p-1 bg-primary/20 rounded-full mt-0.5">
          <ChevronRight className="h-3 w-3 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Tip:</strong> Changes made here will be reflected on the public 
          <span className="text-foreground font-medium mx-1">Policies</span> 
          pages once saved. Each section will be displayed as a heading with its respective body text.
        </p>
      </div>
    </div>
  );
};

export default PoliciesAdmin;
