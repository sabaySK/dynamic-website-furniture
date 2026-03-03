import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";

const BannerAdmin = () => {
  const [shopImage, setShopImage] = useState("");
  const [shopPreTitle, setShopPreTitle] = useState("");
  const [shopTitle, setShopTitle] = useState("");
  const [shopSubtitle, setShopSubtitle] = useState("");

  const [contactImage, setContactImage] = useState("");
  const [contactPreTitle, setContactPreTitle] = useState("");
  const [contactTitle, setContactTitle] = useState("");

  const [saveStatus, setSaveStatus] = useState<{
    shop: "idle" | "saving" | "success" | "error";
    contact: "idle" | "saving" | "success" | "error";
  }>({ shop: "idle", contact: "idle" });
  const [errors, setErrors] = useState({
    shopImage: "",
    shopTitle: "",
    contactImage: "",
    contactTitle: "",
  });

  useEffect(() => {
    setShopImage(getOverride("shop.banner.image", ""));
    setShopPreTitle(getOverride("shop.banner.preTitle", ""));
    setShopTitle(getOverride("shop.banner.title", ""));
    setShopSubtitle(getOverride("shop.banner.subtitle", ""));
    setContactImage(getOverride("contact.banner.image", ""));
    setContactPreTitle(getOverride("contact.banner.preTitle", ""));
    setContactTitle(getOverride("contact.banner.title", ""));
  }, []);

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateShop = () => {
    const next = { shopImage: "", shopTitle: "" };
    let ok = true;

    if (!shopImage.trim()) {
      next.shopImage = "Image URL is required";
      ok = false;
    } else if (!isValidUrl(shopImage)) {
      next.shopImage = "Please enter a valid URL";
      ok = false;
    }

    if (!shopTitle.trim()) {
      next.shopTitle = "Title is required";
      ok = false;
    }

    setErrors((prev) => ({ ...prev, ...next }));
    return ok;
  };

  const validateContact = () => {
    const next = { contactImage: "", contactTitle: "" };
    let ok = true;

    if (!contactImage.trim()) {
      next.contactImage = "Image URL is required";
      ok = false;
    } else if (!isValidUrl(contactImage)) {
      next.contactImage = "Please enter a valid URL";
      ok = false;
    }

    if (!contactTitle.trim()) {
      next.contactTitle = "Title is required";
      ok = false;
    }

    setErrors((prev) => ({ ...prev, ...next }));
    return ok;
  };

  const resetShop = () => {
    setShopImage(getOverride("shop.banner.image", ""));
    setShopPreTitle(getOverride("shop.banner.preTitle", ""));
    setShopTitle(getOverride("shop.banner.title", ""));
    setShopSubtitle(getOverride("shop.banner.subtitle", ""));
    setErrors((prev) => ({ ...prev, shopImage: "", shopTitle: "" }));
    setSaveStatus((prev) => ({ ...prev, shop: "idle" }));
  };

  const resetContact = () => {
    setContactImage(getOverride("contact.banner.image", ""));
    setContactPreTitle(getOverride("contact.banner.preTitle", ""));
    setContactTitle(getOverride("contact.banner.title", ""));
    setErrors((prev) => ({ ...prev, contactImage: "", contactTitle: "" }));
    setSaveStatus((prev) => ({ ...prev, contact: "idle" }));
  };

  const saveShop = async () => {
    if (!validateShop()) return;

    setSaveStatus((prev) => ({ ...prev, shop: "saving" }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setOverrides({
        "shop.banner.image": shopImage,
        "shop.banner.preTitle": shopPreTitle,
        "shop.banner.title": shopTitle,
        "shop.banner.subtitle": shopSubtitle,
      });
      setSaveStatus((prev) => ({ ...prev, shop: "success" }));
      setTimeout(() => setSaveStatus((prev) => ({ ...prev, shop: "idle" })), 2000);
    } catch {
      setSaveStatus((prev) => ({ ...prev, shop: "error" }));
      setTimeout(() => setSaveStatus((prev) => ({ ...prev, shop: "idle" })), 2000);
    }
  };

  const saveContact = async () => {
    if (!validateContact()) return;

    setSaveStatus((prev) => ({ ...prev, contact: "saving" }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setOverrides({
        "contact.banner.image": contactImage,
        "contact.banner.preTitle": contactPreTitle,
        "contact.banner.title": contactTitle,
      });
      setSaveStatus((prev) => ({ ...prev, contact: "success" }));
      setTimeout(() => setSaveStatus((prev) => ({ ...prev, contact: "idle" })), 2000);
    } catch {
      setSaveStatus((prev) => ({ ...prev, contact: "error" }));
      setTimeout(() => setSaveStatus((prev) => ({ ...prev, contact: "idle" })), 2000);
    }
  };

  return (
    <div className="w-full max-w-none space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-display font-semibold">Banners</h2>
        <p className="text-sm text-muted-foreground">Configure hero banners and page headers</p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full border border-border rounded-lg bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold">Shop Banner</h3>
            <span className="text-xs text-muted-foreground">Shop page</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label htmlFor="shop-image" className="text-sm font-body">
                Banner Image URL *
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="shop-image"
                  placeholder="https://example.com/banner-image.jpg"
                  value={shopImage}
                  onChange={(e) => {
                    const next = e.target.value;
                    setShopImage(next);
                    if (errors.shopImage) setErrors((prev) => ({ ...prev, shopImage: "" }));
                  }}
                  className={[
                    "w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm",
                    errors.shopImage ? "border-destructive" : "",
                  ].join(" ")}
                />
                {shopImage ? (
                  <img
                    src={shopImage}
                    alt="Shop banner preview"
                    className="h-10 w-10 rounded border border-border object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
              </div>
              {errors.shopImage ? <p className="text-destructive text-xs">{errors.shopImage}</p> : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Pre-title"
                value={shopPreTitle}
                onChange={(e) => setShopPreTitle(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm"
              />
              <div className="space-y-2">
                <input
                  placeholder="Main Title *"
                  value={shopTitle}
                  onChange={(e) => {
                    const next = e.target.value;
                    setShopTitle(next);
                    if (errors.shopTitle) setErrors((prev) => ({ ...prev, shopTitle: "" }));
                  }}
                  className={[
                    "w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm",
                    errors.shopTitle ? "border-destructive" : "",
                  ].join(" ")}
                />
                {errors.shopTitle ? <p className="text-destructive text-xs">{errors.shopTitle}</p> : null}
              </div>
            </div>

            <textarea
              placeholder="Subtitle"
              rows={3}
              value={shopSubtitle}
              onChange={(e) => setShopSubtitle(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm"
            />

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs">
                {saveStatus.shop === "success" ? (
                  <span className="text-primary">Saved</span>
                ) : saveStatus.shop === "error" ? (
                  <span className="text-destructive">Save failed</span>
                ) : null}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetShop}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={saveShop}
                  disabled={saveStatus.shop === "saving"}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-body disabled:opacity-50"
                >
                  {saveStatus.shop === "saving" ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border border-border rounded-lg bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold">Contact Banner</h3>
            <span className="text-xs text-muted-foreground">Contact page</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label htmlFor="contact-image" className="text-sm font-body">
                Banner Image URL *
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="contact-image"
                  placeholder="https://example.com/contact-banner.jpg"
                  value={contactImage}
                  onChange={(e) => {
                    const next = e.target.value;
                    setContactImage(next);
                    if (errors.contactImage) setErrors((prev) => ({ ...prev, contactImage: "" }));
                  }}
                  className={[
                    "w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm",
                    errors.contactImage ? "border-destructive" : "",
                  ].join(" ")}
                />
                {contactImage ? (
                  <img
                    src={contactImage}
                    alt="Contact banner preview"
                    className="h-10 w-10 rounded border border-border object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
              </div>
              {errors.contactImage ? <p className="text-destructive text-xs">{errors.contactImage}</p> : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Pre-title"
                value={contactPreTitle}
                onChange={(e) => setContactPreTitle(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm"
              />
              <div className="space-y-2">
                <input
                  placeholder="Main Title *"
                  value={contactTitle}
                  onChange={(e) => {
                    const next = e.target.value;
                    setContactTitle(next);
                    if (errors.contactTitle) setErrors((prev) => ({ ...prev, contactTitle: "" }));
                  }}
                  className={[
                    "w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm",
                    errors.contactTitle ? "border-destructive" : "",
                  ].join(" ")}
                />
                {errors.contactTitle ? <p className="text-destructive text-xs">{errors.contactTitle}</p> : null}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs">
                {saveStatus.contact === "success" ? (
                  <span className="text-primary">Saved</span>
                ) : saveStatus.contact === "error" ? (
                  <span className="text-destructive">Save failed</span>
                ) : null}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetContact}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-body hover:bg-muted/50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={saveContact}
                  disabled={saveStatus.contact === "saving"}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-body disabled:opacity-50"
                >
                  {saveStatus.contact === "saving" ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerAdmin;
