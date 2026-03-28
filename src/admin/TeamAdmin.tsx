import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, Eye, Copy } from "lucide-react";
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

type TeamMemberItem = {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  image?: string;
  fileName?: string;
};


const defaultTeam: TeamMemberItem[] = [
  {
    fullName: "Erik Lindström",
    role: "Founder & CEO",
    email: "erik@nord.com",
    phone: "0968255000",
    bio: "Visionary leader with a passion for Scandinavian design and sustainable craftsmanship.",
  },
  {
    fullName: "Anna Berg",
    role: "Head of Design",
    email: "anna@nord.com",
    phone: "0968255000",
    bio: "Award-winning designer focusing on honest materials and timeless aesthetics.",
  },
  {
    fullName: "Marcus Holm",
    role: "Workshop Director",
    email: "marcus@nord.com",
    phone: "0968255000",
    bio: "Master craftsman overseeing our production and artisan partnerships.",
  },
];

function safeParseTeam(raw: string): TeamMemberItem[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const normalized: TeamMemberItem[] = parsed.map((t: any) => {
      return {
        fullName: typeof t?.fullName === "string" ? t.fullName : (typeof t?.name === "string" ? t.name : ""),
        role: typeof t?.role === "string" ? t.role : "",
        email: typeof t?.email === "string" ? t.email : "",
        phone: typeof t?.phone === "string" ? t.phone : "",
        bio: typeof t?.bio === "string" ? t.bio : (typeof t?.address === "string" ? t.address : ""),
        image: typeof t?.image === "string" ? t.image : "",
        fileName: typeof t?.fileName === "string" ? t.fileName : "",
      };

    });
    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

const TeamAdmin = () => {
  const [items, setItems] = useState<TeamMemberItem[]>(defaultTeam);
  const [saving, setSaving] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const [newMember, setNewMember] = useState<TeamMemberItem>({
    fullName: "",
    role: "",
    email: "",
    phone: "",
    bio: "",
    image: "",
    fileName: "",
  });


  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);
  const [viewingMember, setViewingMember] = useState<TeamMemberItem | null>(null);

  useEffect(() => {
    const overrideItemsRaw = getOverride("about.team.items", "");
    const parsed = overrideItemsRaw ? safeParseTeam(overrideItemsRaw) : null;
    setItems(parsed ?? defaultTeam);
  }, []);

  const handleAddSubmit = () => {
    if (!newMember.fullName.trim() || !newMember.role.trim()) {
      toast.error("Please fill in Name and Role.");
      return;
    }
    setItems((prev) => [...prev, newMember]);
    setNewMember({
      fullName: "",
      role: "",
      email: "",
      phone: "",
      bio: "",
      fileName: "",
    });
    setIsAddOpen(false);
  };

  const handleSetNewImageFromFile = (file: File | null) => {
    setNewImageFile(file ?? null);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setNewMember((prev) => ({ ...prev, image: result, fileName: prev.fileName || file.name }));
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied!"));
  };

  const handleSetEditImageFromFile = (file: File | null) => {
    setEditImageFile(file ?? null);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (editingMember) {
        setEditingMember({ ...editingMember, image: result, fileName: editingMember.fileName || file.name });
      }
    };
    reader.readAsDataURL(file);
  };

  const openEdit = (index: number) => {

    setSelectedIdx(index);
    setEditingMember({ ...items[index] });
    setIsEditOpen(true);
  };

  const handleEditSubmit = () => {
    if (selectedIdx === null || !editingMember) return;
    if (!editingMember.fullName.trim() || !editingMember.role.trim()) {
      toast.error("Please fill in Name and Role.");
      return;
    }
    setItems((prev) => prev.map((it, i) => (i === selectedIdx ? editingMember : it)));
    setIsEditOpen(false);
  };

  const openView = (index: number) => {
    setViewingMember(items[index]);
    setIsViewOpen(true);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const save = () => {
    setSaving(true);
    setOverrides({
      "about.team.items": JSON.stringify(items),
    });
    setTimeout(() => {
      setSaving(false);
      toast.success("Team members updated");
    }, 600);
  };

  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-display font-semibold">Team Members</h3>
                <p className="text-xs text-muted-foreground font-body">Manage your team members.</p>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>

                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Member
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Full Name*</label>
                        <input
                          required
                          value={newMember.fullName}
                          onChange={(e) => setNewMember({ ...newMember, fullName: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Role*</label>
                        <input
                          required
                          value={newMember.role}
                          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          placeholder="Founder & CEO"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Email</label>
                        <input
                          type="email"
                          value={newMember.email}
                          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          placeholder="john@nord.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Phone</label>
                        <input
                          value={newMember.phone}
                          onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          placeholder="+1 234 567 890"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Profile Image</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSetNewImageFromFile(e.target.files?.[0] ?? null)}
                            className="block w-full text-sm flex-1 bg-background border border-border rounded-lg px-3 py-2"
                          />
                          {newMember.image ? (
                            <img src={newMember.image} alt="Preview" className="h-10 w-10 rounded border border-border object-cover" />
                          ) : null}
                        </div>
                        {newImageFile && (
                          <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/40 border border-border rounded-lg">
                            <span className="text-xs font-body text-foreground truncate flex-1">
                              <span className="font-medium">{newImageFile.name}</span>
                              <span className="text-muted-foreground"> : {formatFileSize(newImageFile.size)}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(newImageFile.name)}
                              className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                              title="Copy file name"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">File Name</label>
                        <div className="flex items-center gap-2">
                          <input
                            value={newMember.fileName ?? ""}
                            onChange={(e) => setNewMember({ ...newMember, fileName: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            placeholder="e.g. team-photo.jpg"
                          />
                          <button
                            type="button"
                            onClick={() => copyToClipboard(newMember.fileName ?? "")}
                            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="Copy file name"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Bio</label>


                        <textarea
                          value={newMember.bio}
                          onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                          placeholder="Short biography"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <button
                        onClick={() => setIsAddOpen(false)}
                        className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddSubmit}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors"
                      >
                        Save Member
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table className="table-fixed min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Full Name</TableHead>
                    <TableHead className="w-[15%]">Role</TableHead>
                    <TableHead className="w-[20%]">Email</TableHead>
                    <TableHead className="w-[30%]">Bio</TableHead>
                    <TableHead className="w-[15%]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {it.fullName}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {it.role}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {it.email}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <span className="px-2 py-1.5 text-sm font-body truncate block w-full">
                          {it.bio}
                        </span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openView(idx)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(idx)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Edit Dialog */}
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Team Member</DialogTitle>
                  </DialogHeader>
                  {editingMember && (
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Full Name*</label>
                        <input
                          required
                          value={editingMember.fullName}
                          onChange={(e) => setEditingMember({ ...editingMember, fullName: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Role*</label>
                        <input
                          required
                          value={editingMember.role}
                          onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Email</label>
                        <input
                          type="email"
                          value={editingMember.email}
                          onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Phone</label>
                        <input
                          value={editingMember.phone}
                          onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Profile Image</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSetEditImageFromFile(e.target.files?.[0] ?? null)}
                            className="block w-full text-sm flex-1 bg-background border border-border rounded-lg px-3 py-2"
                          />
                          {editingMember.image ? (
                            <img src={editingMember.image} alt="Preview" className="h-10 w-10 rounded border border-border object-cover" />
                          ) : null}
                        </div>
                        {editImageFile && (
                          <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/40 border border-border rounded-lg">
                            <span className="text-xs font-body text-foreground truncate flex-1">
                              <span className="font-medium">{editImageFile.name}</span>
                              <span className="text-muted-foreground"> : {formatFileSize(editImageFile.size)}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(editImageFile.name)}
                              className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                              title="Copy file name"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">File Name</label>
                        <div className="flex items-center gap-2">
                          <input
                            value={editingMember.fileName ?? ""}
                            onChange={(e) => setEditingMember({ ...editingMember, fileName: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            placeholder="e.g. team-photo.jpg"
                          />
                          <button
                            type="button"
                            onClick={() => copyToClipboard(editingMember.fileName ?? "")}
                            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="Copy file name"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Bio</label>


                        <textarea
                          value={editingMember.bio}
                          onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleEditSubmit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors">
                      Save Changes
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* View Dialog */}
              <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>View Team Member</DialogTitle>
                  </DialogHeader>
                  {viewingMember && (
                    <div className="grid gap-4 py-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Full Name</p>
                        <p className="font-body text-sm font-medium">{viewingMember.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Role</p>
                        <p className="font-body text-sm">{viewingMember.role}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Email</p>
                        <p className="font-body text-sm">{viewingMember.email || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Phone</p>
                        <p className="font-body text-sm">{viewingMember.phone || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Image</p>
                        {viewingMember.image ? (
                          <div className="mt-1 rounded-lg overflow-hidden border border-border w-24 h-24">
                            <img src={viewingMember.image} alt={viewingMember.fullName} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <p className="font-body text-sm">—</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Bio</p>

                        <p className="font-body text-sm whitespace-pre-wrap">{viewingMember.bio || "—"}</p>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <button onClick={() => setIsViewOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors">
                      Close
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAdmin;
