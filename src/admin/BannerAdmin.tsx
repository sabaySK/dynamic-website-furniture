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

  const [saveStatus, setSaveStatus] = useState<{shop: 'idle' | 'saving' | 'success' | 'error', contact: 'idle' | 'saving' | 'success' | 'error'}>({shop: 'idle', contact: 'idle'});
  const [errors, setErrors] = useState({
    shopImage: '',
    shopTitle: '',
    contactImage: '',
    contactTitle: ''
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

  const validateForm = () => {
    const newErrors = {
      shopImage: '',
      shopTitle: '',
      contactImage: '',
      contactTitle: ''
    };
    
    let isValid = true;
    
    // Validate shop banner
    if (!shopImage.trim()) {
      newErrors.shopImage = 'Image URL is required';
      isValid = false;
    } else if (!isValidUrl(shopImage)) {
      newErrors.shopImage = 'Please enter a valid URL';
      isValid = false;
    }
    
    if (!shopTitle.trim()) {
      newErrors.shopTitle = 'Title is required';
      isValid = false;
    }
    
    // Validate contact banner
    if (!contactImage.trim()) {
      newErrors.contactImage = 'Image URL is required';
      isValid = false;
    } else if (!isValidUrl(contactImage)) {
      newErrors.contactImage = 'Please enter a valid URL';
      isValid = false;
    }
    
    if (!contactTitle.trim()) {
      newErrors.contactTitle = 'Title is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const saveShop = async () => {
    if (!validateForm()) return;
    
    setSaveStatus(prev => ({...prev, shop: 'saving'}));
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      setOverrides({
        "shop.banner.image": shopImage,
        "shop.banner.preTitle": shopPreTitle,
        "shop.banner.title": shopTitle,
        "shop.banner.subtitle": shopSubtitle,
      });
      setSaveStatus(prev => ({...prev, shop: 'success'}));
      setTimeout(() => setSaveStatus(prev => ({...prev, shop: 'idle'})), 2000);
    } catch (error) {
      setSaveStatus(prev => ({...prev, shop: 'error'}));
      setTimeout(() => setSaveStatus(prev => ({...prev, shop: 'idle'})), 2000);
    }
  };

  const saveContact = async () => {
    if (!validateForm()) return;
    
    setSaveStatus(prev => ({...prev, contact: 'saving'}));
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      setOverrides({
        "contact.banner.image": contactImage,
        "contact.banner.preTitle": contactPreTitle,
        "contact.banner.title": contactTitle,
      });
      setSaveStatus(prev => ({...prev, contact: 'success'}));
      setTimeout(() => setSaveStatus(prev => ({...prev, contact: 'idle'})), 2000);
    } catch (error) {
      setSaveStatus(prev => ({...prev, contact: 'error'}));
      setTimeout(() => setSaveStatus(prev => ({...prev, contact: 'idle'})), 2000);
    }
  };

  return (
    <div className="w-full max-w-none flex flex-col flex-1 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold">Manage Banners</h2>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="w-full border border-border rounded-lg bg-card flex flex-col h-full">
          <div className="p-6 flex-1">
            <h3 className="text-lg font-display font-semibold mb-4">Shop Banner</h3>
            
            <div className="grid grid-cols-1 gap-4 h-full">
              <div>
                <input
                  placeholder="Image URL"
                  value={shopImage}
                  onChange={(e) => {
                    setShopImage(e.target.value);
                    if (errors.shopImage && shopImage) {
                      setErrors({...errors, shopImage: ''});
                    }
                  }}
                  className={`w-full bg-card border border-border rounded-lg px-4 py-3 text-sm ${errors.shopImage ? 'border-red-500' : ''}`}
                />
                {errors.shopImage && <p className="text-red-500 text-sm mt-1">{errors.shopImage}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    placeholder="Pre-title"
                    value={shopPreTitle}
                    onChange={(e) => setShopPreTitle(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <input
                    placeholder="Title"
                    value={shopTitle}
                    onChange={(e) => {
                      setShopTitle(e.target.value);
                      if (errors.shopTitle && shopTitle) {
                        setErrors({...errors, shopTitle: ''});
                      }
                    }}
                    className={`w-full bg-card border border-border rounded-lg px-4 py-3 text-sm ${errors.shopTitle ? 'border-red-500' : ''}`}
                  />
                  {errors.shopTitle && <p className="text-red-500 text-sm mt-1">{errors.shopTitle}</p>}
                </div>
              </div>
              
              <div className="flex-1">
                <textarea
                  placeholder="Subtitle"
                  rows={3}
                  value={shopSubtitle}
                  onChange={(e) => setShopSubtitle(e.target.value)}
                  className="w-full h-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
                />
              </div>
              
              <div className="flex justify-end pt-2">
                <button 
                  onClick={saveShop}
                  disabled={saveStatus.shop === 'saving'}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-body inline-flex items-center gap-2"
                >
                  {saveStatus.shop === 'saving' && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  )}
                  <span>{saveStatus.shop === 'saving' ? 'Saving...' : 'Save Shop Banner'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border border-border rounded-lg bg-card flex flex-col h-full">
          <div className="p-6 flex-1">
            <h3 className="text-lg font-display font-semibold mb-4">Contact Banner</h3>
            
            <div className="grid grid-cols-1 gap-4 h-full">
              <div>
                <input
                  placeholder="Image URL"
                  value={contactImage}
                  onChange={(e) => {
                    setContactImage(e.target.value);
                    if (errors.contactImage && contactImage) {
                      setErrors({...errors, contactImage: ''});
                    }
                  }}
                  className={`w-full bg-card border border-border rounded-lg px-4 py-3 text-sm ${errors.contactImage ? 'border-red-500' : ''}`}
                />
                {errors.contactImage && <p className="text-red-500 text-sm mt-1">{errors.contactImage}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    placeholder="Pre-title"
                    value={contactPreTitle}
                    onChange={(e) => setContactPreTitle(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <input
                    placeholder="Title"
                    value={contactTitle}
                    onChange={(e) => {
                      setContactTitle(e.target.value);
                      if (errors.contactTitle && contactTitle) {
                        setErrors({...errors, contactTitle: ''});
                      }
                    }}
                    className={`w-full bg-card border border-border rounded-lg px-4 py-3 text-sm ${errors.contactTitle ? 'border-red-500' : ''}`}
                  />
                  {errors.contactTitle && <p className="text-red-500 text-sm mt-1">{errors.contactTitle}</p>}
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button 
                  onClick={saveContact}
                  disabled={saveStatus.contact === 'saving'}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-body inline-flex items-center gap-2"
                >
                  {saveStatus.contact === 'saving' && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  )}
                  <span>{saveStatus.contact === 'saving' ? 'Saving...' : 'Save Contact Banner'}</span>
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
