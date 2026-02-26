import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";

const FooterAdmin = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    setEmail(getOverride("footer.email", ""));
    setPhone(getOverride("footer.phone", ""));
    setLocation(getOverride("footer.location", ""));
  }, []);

  const save = () => {
    setOverrides({
      "footer.email": email,
      "footer.phone": phone,
      "footer.location": location,
    });
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-display font-semibold">Footer Contact Info</h2>
      <input className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <button onClick={save} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-body text-sm">Save</button>
    </div>
  );
};

export default FooterAdmin;
