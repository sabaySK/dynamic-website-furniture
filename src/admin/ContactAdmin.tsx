import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";
import { toast } from "sonner";
import { Edit, Plus, Trash2, Loader2 } from "lucide-react";

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

type ContactItem = {
  company_name: string;
  phone: string;
  email: string;
  address: string;
  lat: string;
  lang: string;
  social_media: {
    facebook: string;
    instagram: string;
    telegram: string;
  };
  working_hours: string;
};

const defaultContact: ContactItem = {
  company_name: "NORD",
  phone: "0123456789",
  email: "nord@gmail.com",
  address: "Phnom Penh",
  lat: "11.5777",
  lang: "104.8778304",
  social_media: {
    facebook: "https://facebook.com/nord",
    instagram: "https://instagram.com/nord",
    telegram: "https://t.me/nord",
  },
  working_hours: "Mon-Fri 8:00-17:00",
};

function safeParseContacts(raw: string): ContactItem[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map((c: any) => ({
      company_name: c?.company_name || "",
      phone: c?.phone || "",
      email: c?.email || "",
      address: c?.address || "",
      lat: c?.lat || "",
      lang: c?.lang || "",
      social_media: {
        facebook: c?.social_media?.facebook || "",
        instagram: c?.social_media?.instagram || "",
        telegram: c?.social_media?.telegram || "",
      },
      working_hours: c?.working_hours || "",
    }));
  } catch {
    return null;
  }
}

const ContactAdmin = () => {
  const [items, setItems] = useState<ContactItem[]>([defaultContact]);
  const [saving, setSaving] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const [newContact, setNewContact] = useState<ContactItem>({
    company_name: "",
    phone: "",
    email: "",
    address: "",
    lat: "",
    lang: "",
    social_media: { facebook: "", instagram: "", telegram: "" },
    working_hours: "",
  });

  const [editingContact, setEditingContact] = useState<ContactItem | null>(null);

  useEffect(() => {
    const raw = getOverride("admin.contact.items", "");
    const parsed = raw ? safeParseContacts(raw) : null;
    setItems(parsed ?? [defaultContact]);
  }, []);

  const handleAddSubmit = () => {
    if (!newContact.company_name.trim() || !newContact.email.trim() || !newContact.phone.trim()) {
      toast.error("Please fill in Company Name, Email, and Phone.");
      return;
    }
    setItems((prev) => [...prev, newContact]);
    setNewContact({
      company_name: "",
      phone: "",
      email: "",
      address: "",
      lat: "",
      lang: "",
      social_media: { facebook: "", instagram: "", telegram: "" },
      working_hours: "",
    });
    setIsAddOpen(false);
  };

  const openEdit = (index: number) => {
    setSelectedIdx(index);
    setEditingContact({ ...items[index] });
    setIsEditOpen(true);
  };

  const handleEditSubmit = () => {
    if (selectedIdx === null || !editingContact) return;
    if (!editingContact.company_name.trim() || !editingContact.email.trim() || !editingContact.phone.trim()) {
      toast.error("Please fill in Company Name, Email, and Phone.");
      return;
    }
    setItems((prev) => prev.map((it, i) => (i === selectedIdx ? editingContact : it)));
    setIsEditOpen(false);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      toast.error("At least one contact is required.");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const save = () => {
    setSaving(true);
    const main = items[0];
    setOverrides({
      "admin.contact.items": JSON.stringify(items),
      // Individual overrides for the primary record
      "contact.company.name": main.company_name,
      "contact.phone": main.phone,
      "contact.email": main.email,
      "contact.address": main.address,
      "contact.lat": main.lat,
      "contact.lang": main.lang,
      "contact.facebook": main.social_media.facebook,
      "contact.instagram": main.social_media.instagram,
      "contact.telegram": main.social_media.telegram,
      "contact.working.hours": main.working_hours,
    });
    setTimeout(() => {
      setSaving(false);
      toast.success("Contact settings updated");
    }, 600);
  };

  const ContactForm = ({ data, setData }: { data: ContactItem; setData: (d: ContactItem) => void }) => (
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-body font-medium">Company Name*</label>
          <input
            required
            value={data.company_name}
            onChange={(e) => setData({ ...data, company_name: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
            placeholder="NORD"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-body font-medium">Phone*</label>
          <input
            required
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
            placeholder="0123456789"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-body font-medium">Email*</label>
          <input
            type="email"
            required
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
            placeholder="nord@gmail.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-body font-medium">Working Hours</label>
          <input
            value={data.working_hours}
            onChange={(e) => setData({ ...data, working_hours: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
            placeholder="Mon-Fri 8:00-17:00"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-body font-medium">Address</label>
        <textarea
          value={data.address}
          onChange={(e) => setData({ ...data, address: e.target.value })}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
          rows={2}
          placeholder="Phnom Penh"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-body font-medium">Latitude</label>
          <input
            value={data.lat}
            onChange={(e) => setData({ ...data, lat: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
            placeholder="11.5777"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-body font-medium">Longitude</label>
          <input
            value={data.lang}
            onChange={(e) => setData({ ...data, lang: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
            placeholder="104.8778304"
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-body font-bold text-primary uppercase tracking-widest mt-2">Social Media</p>
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-muted-foreground font-medium">Facebook</label>
            <input
              value={data.social_media.facebook}
              onChange={(e) => setData({ ...data, social_media: { ...data.social_media, facebook: e.target.value } })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-muted-foreground font-medium">Instagram</label>
            <input
              value={data.social_media.instagram}
              onChange={(e) => setData({ ...data, social_media: { ...data.social_media, instagram: e.target.value } })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-muted-foreground font-medium">Telegram</label>
            <input
              value={data.social_media.telegram}
              onChange={(e) => setData({ ...data, social_media: { ...data.social_media, telegram: e.target.value } })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body focus:ring-2 focus:ring-primary/20 focus:outline-none"
              placeholder="https://t.me/..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="bg-card border border-border rounded-lg shadow-sm w-full max-none">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-display font-semibold">Contact Management</h3>
              <p className="text-xs text-muted-foreground font-body">Manage branch information and social links.</p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Branch
                </button>
                <DialogContent className="max-w-2xl">
                  <DialogHeader><DialogTitle>Create New Branch</DialogTitle></DialogHeader>
                  <ContactForm data={newContact} setData={setNewContact} />
                  <DialogFooter>
                    <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-body">Cancel</button>
                    <button onClick={handleAddSubmit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body">Create</button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table className="table-fixed min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[15%]">Company</TableHead>
                  <TableHead className="w-[15%]">Phone</TableHead>
                  <TableHead className="w-[20%]">Email</TableHead>
                  <TableHead className="w-[35%]">Address</TableHead>
                  <TableHead className="w-[15%]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="p-2 align-middle truncate font-body text-sm px-4">{it.company_name}</TableCell>
                    <TableCell className="p-2 align-middle truncate font-body text-sm px-4">{it.phone}</TableCell>
                    <TableCell className="p-2 align-middle truncate font-body text-sm px-4">{it.email}</TableCell>
                    <TableCell className="p-2 align-middle truncate font-body text-sm px-4">{it.address}</TableCell>
                    <TableCell className="p-2 align-middle px-4">
                      <div className="flex items-center gap-1">
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit Branch Detail</DialogTitle></DialogHeader>
          {editingContact && <ContactForm data={editingContact} setData={setEditingContact} />}
          <DialogFooter>
            <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-body">Cancel</button>
            <button onClick={handleEditSubmit} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body">Update</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactAdmin;
