import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
<<<<<<< HEAD
import { Loader2, Plus, Trash2, Edit, Eye, Copy } from "lucide-react";
=======
import { Plus, Trash2, Edit, Eye } from "lucide-react";
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2
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
} from "@/components/ui/dialog";
import Loading from "@/components/ui/loading";
import Empty from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  createTeam,
  deleteTeam,
  fetchTeamsPage,
  updateTeam,
  type TeamItem,
} from "@/services/admin-service/team/team.service";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";

<<<<<<< HEAD
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
=======
type TeamForm = {
  name: string;
  description: string;
};

const emptyForm: TeamForm = {
  name: "",
  description: "",
};
const PAGE_SIZE = 10;

const TeamAdmin = () => {
  const [items, setItems] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [newMember, setNewMember] = useState<TeamForm>(emptyForm);
  const [editingMember, setEditingMember] = useState<TeamItem | null>(null);
  const [editingForm, setEditingForm] = useState<TeamForm>(emptyForm);
  const [viewingMember, setViewingMember] = useState<TeamItem | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<TeamItem | null>(null);

<<<<<<< HEAD
  const [newMember, setNewMember] = useState<TeamMemberItem>({
    fullName: "",
    role: "",
    email: "",
    phone: "",
    bio: "",
    image: "",
    fileName: "",
  });
=======
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "dots-right", totalPages] as const;
    if (page >= totalPages - 2) return [1, "dots-left", totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const;
    return [1, "dots-left", page - 1, page, page + 1, "dots-right", totalPages] as const;
  }, [page, totalPages]);
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2

  const loadTeams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchTeamsPage({ page, limit: PAGE_SIZE }, { suppress401Redirect: true });
      setItems(res.list);
      setTotal(res.total);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch teams";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadTeams();
  }, [loadTeams]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleAddSubmit = async () => {
    if (!newMember.name.trim()) {
      toast.error("Please fill in Name.");
      return;
    }
<<<<<<< HEAD
    setItems((prev) => [...prev, newMember]);
    setNewMember({
      fullName: "",
      role: "",
      email: "",
      phone: "",
      bio: "",
      fileName: "",
    });
=======
    setCreating(true);
    try {
      await createTeam(
        {
          name: newMember.name.trim(),
          description: newMember.description.trim() || null,
        },
        { suppress401Redirect: true }
      );
      toast.success("Team member created");
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2
    setIsAddOpen(false);
      setNewMember(emptyForm);
      if (page !== 1) setPage(1);
      else void loadTeams();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create team member";
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

<<<<<<< HEAD
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
=======
  const openEdit = (team: TeamItem) => {
    setEditingMember(team);
    setEditingForm({
      name: team.name ?? "",
      description: team.description ?? "",
    });
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2
    setIsEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingMember) return;
    if (!editingForm.name.trim()) {
      toast.error("Please fill in Name.");
      return;
    }
    setUpdating(true);
    try {
      await updateTeam(
        editingMember.id,
        {
          name: editingForm.name.trim(),
          description: editingForm.description.trim() || null,
        },
        { suppress401Redirect: true }
      );
      toast.success("Team member updated");
    setIsEditOpen(false);
      setEditingMember(null);
      void loadTeams();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update team member";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const openView = (team: TeamItem) => {
    setViewingMember(team);
    setIsViewOpen(true);
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;
    const team = teamToDelete;
    setDeletingId(team.id);
    try {
      await deleteTeam(team.id, { suppress401Redirect: true });
      toast.success("Team member deleted");
      setDeleteDialogOpen(false);
      setTeamToDelete(null);
      void loadTeams();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete team member";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-w-none">
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-display font-semibold">Team Members</h3>
                <p className="text-xs text-muted-foreground font-body">API content from `/admin/about/teams`.</p>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <button
                      type="button"
                    onClick={() => setIsAddOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Member
                    </button>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Name*</label>
                        <input
                          required
                          value={newMember.name}
                          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          placeholder="Erik Lindstrom"
                        />
                      </div>
                      <div className="space-y-2">
<<<<<<< HEAD
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


=======
                        <label className="text-xs font-body font-medium">Description</label>
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2
                        <textarea
                          value={newMember.description}
                          onChange={(e) => setNewMember({ ...newMember, description: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                          placeholder="Founder & CEO"
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
                        disabled={creating}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors"
                      >
                        {creating ? "Saving..." : "Save Member"}
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
                    <TableHead className="w-[28%]">Name</TableHead>
                    <TableHead className="w-[57%]">Description</TableHead>
                    <TableHead className="w-[15%]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="p-0">
                        <div className="flex min-h-[180px] items-center justify-center py-8">
                          <Loading size={24} className="text-primary" message="Loading team..." />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="p-0">
                        <Empty title="No team members found" description="No record was returned from /admin/about/teams." />
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((it) => (
                      <TableRow key={String(it.id)}>
                      <TableCell className="p-2 align-middle">
                          <span className="px-2 py-1.5 text-sm font-body truncate block w-full">{it.name || "—"}</span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                          <span className="px-2 py-1.5 text-sm font-body truncate block w-full">{it.description || "—"}</span>
                      </TableCell>
                      <TableCell className="p-2 align-middle">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                              onClick={() => openView(it)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                              onClick={() => openEdit(it)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                              disabled={deletingId === it.id}
                              onClick={() => {
                                setTeamToDelete(it);
                                setDeleteDialogOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-60"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {!loading && total > 0 ? (
                <div className="flex flex-col gap-3 border-t border-border px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-xs text-muted-foreground font-body">
                    Showing page {page} of {totalPages} ({total} team members)
                  </p>
                  <Pagination className="mx-0 w-auto justify-start md:justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) setPage(page - 1);
                          }}
                          className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {pageItems.map((p, idx) =>
                        typeof p === "number" ? (
                          <PaginationItem key={`page-${p}-${idx}`}>
                            <PaginationLink
                              href="#"
                              isActive={p === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(p);
                              }}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`dots-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) setPage(page + 1);
                          }}
                          className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              ) : null}

              <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                  setDeleteDialogOpen(open);
                  if (!open) setTeamToDelete(null);
                }}
                title="Delete team member?"
                description={
                  teamToDelete
                    ? `This will permanently remove "${teamToDelete.name}". This action cannot be undone.`
                    : "This action cannot be undone."
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
                destructive
                loading={Boolean(teamToDelete && deletingId === teamToDelete.id)}
                onConfirm={handleDeleteTeam}
              />

              {/* Edit Dialog */}
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Team Member</DialogTitle>
                  </DialogHeader>
                  {editingMember && (
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-xs font-body font-medium">Name*</label>
                        <input
                          required
                          value={editingForm.name}
                          onChange={(e) => setEditingForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
<<<<<<< HEAD
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


=======
                        <label className="text-xs font-body font-medium">Description</label>
>>>>>>> cd9dc523dcaa8da03d2f06f16c0bdf565c7a41e2
                        <textarea
                          value={editingForm.description}
                          onChange={(e) => setEditingForm((prev) => ({ ...prev, description: e.target.value }))}
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
                    <button
                      onClick={handleEditSubmit}
                      disabled={updating}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {updating ? "Saving..." : "Save Changes"}
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
                        <p className="text-xs text-muted-foreground font-body">Name</p>
                        <p className="font-body text-sm font-medium">{viewingMember.name || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">About ID</p>
                        <p className="font-body text-sm">{viewingMember.about_id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-body">Description</p>
                        <p className="font-body text-sm whitespace-pre-wrap">{viewingMember.description || "—"}</p>
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
