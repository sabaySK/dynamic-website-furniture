import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";

const ContactAdmin = () => {
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setAddress1(getOverride("contact.address.line1", ""));
    setAddress2(getOverride("contact.address.line2", ""));
    setEmail(getOverride("contact.email", ""));
    setPhone(getOverride("contact.phone", ""));
  }, []);

  const save = () => {
    setOverrides({
      "contact.address.line1": address1,
      "contact.address.line2": address2,
      "contact.email": email,
      "contact.phone": phone,
    });
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-display font-semibold">Contact Information</h2>
      <input className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm" placeholder="Address line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
      <input className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm" placeholder="Address line 2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
      <input className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={save} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-body text-sm">Save</button>
    </div>
  );
};

export default ContactAdmin;
