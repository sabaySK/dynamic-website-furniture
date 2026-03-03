import { useState, useEffect } from "react";
import { setOverrides, getOverride } from "@/lib/overrides";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Image as ImageIcon, Save, Loader2 } from "lucide-react";

interface Banner {
  id: string;
  name: string;
  page: string;
  image: string;
  preTitle: string;
  title: string;
  subtitle?: string;
}

const BannerList = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    name: '',
    page: '',
    image: '',
    preTitle: '',
    title: '',
    subtitle: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    page: '',
    image: '',
    title: ''
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = () => {
    const loadedBanners: Banner[] = [
      {
        id: 'shop-banner',
        name: 'Shop Banner',
        page: 'Shop',
        image: getOverride("shop.banner.image", ""),
        preTitle: getOverride("shop.banner.preTitle", ""),
        title: getOverride("shop.banner.title", ""),
        subtitle: getOverride("shop.banner.subtitle", "")
      },
      {
        id: 'contact-banner',
        name: 'Contact Banner',
        page: 'Contact',
        image: getOverride("contact.banner.image", ""),
        preTitle: getOverride("contact.banner.preTitle", ""),
        title: getOverride("contact.banner.title", "")
      }
    ];
    setBanners(loadedBanners);
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      page: '',
      image: '',
      title: ''
    };
    
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.page.trim()) {
      newErrors.page = 'Page is required';
      isValid = false;
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
      isValid = false;
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
      isValid = false;
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      page: '',
      image: '',
      preTitle: '',
      title: '',
      subtitle: ''
    });
    setErrors({
      name: '',
      page: '',
      image: '',
      title: ''
    });
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newBanner: Banner = {
        id: formData.name.toLowerCase().replace(/\s+/g, '-'),
        ...formData
      };
      
      setBanners([...banners, newBanner]);
      setIsCreateOpen(false);
      resetForm();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      name: banner.name,
      page: banner.page,
      image: banner.image,
      preTitle: banner.preTitle,
      title: banner.title,
      subtitle: banner.subtitle || ''
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedBanners = banners.map(banner => 
        banner.id === editingBanner?.id 
          ? { ...banner, ...formData }
          : banner
      );
      
      setBanners(updatedBanners);
      setIsEditOpen(false);
      setEditingBanner(null);
      resetForm();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      setBanners(banners.filter(banner => banner.id !== id));
    }
  };

  const BannerForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Banner Name *
          </Label>
          <Input
            id="name"
            placeholder="My Banner"
            value={formData.name}
            onChange={(e) => {
              setFormData({...formData, name: e.target.value});
              if (errors.name && e.target.value) {
                setErrors({...errors, name: ''});
              }
            }}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.name}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="page" className="text-sm font-medium">
            Page *
          </Label>
          <Select value={formData.page} onValueChange={(value) => setFormData({...formData, page: value})}>
            <SelectTrigger className={errors.page ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Shop">Shop</SelectItem>
              <SelectItem value="Contact">Contact</SelectItem>
              <SelectItem value="Home">Home</SelectItem>
              <SelectItem value="About">About</SelectItem>
              <SelectItem value="Blog">Blog</SelectItem>
            </SelectContent>
          </Select>
          {errors.page && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.page}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image" className="text-sm font-medium flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Image URL *
        </Label>
        <div className="relative">
          <Input
            id="image"
            placeholder="https://example.com/banner-image.jpg"
            value={formData.image}
            onChange={(e) => {
              setFormData({...formData, image: e.target.value});
              if (errors.image && e.target.value) {
                setErrors({...errors, image: ''});
              }
            }}
            className={`pr-10 ${errors.image ? 'border-red-500' : ''}`}
          />
          {formData.image && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <img 
                src={formData.image} 
                alt="Preview" 
                className="w-6 h-6 rounded object-cover border"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
          )}
        </div>
        {errors.image && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors.image}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="preTitle" className="text-sm font-medium">
            Pre-title
          </Label>
          <Input
            id="preTitle"
            placeholder="New Collection"
            value={formData.preTitle}
            onChange={(e) => setFormData({...formData, preTitle: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Main Title *
          </Label>
          <Input
            id="title"
            placeholder="Premium Furniture"
            value={formData.title}
            onChange={(e) => {
              setFormData({...formData, title: e.target.value});
              if (errors.title && e.target.value) {
                setErrors({...errors, title: ''});
              }
            }}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.title}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle" className="text-sm font-medium">
          Subtitle
        </Label>
        <Textarea
          id="subtitle"
          placeholder="Discover our exclusive collection of handcrafted furniture pieces..."
          rows={3}
          value={formData.subtitle}
          onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
          className="resize-none"
        />
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col flex-1 space-y-6">
      <div className="flex items-center justify-between px-6">
        <div>
          <h2 className="text-2xl font-display font-semibold">Manage Banners</h2>
          <p className="text-sm text-muted-foreground mt-1">Create and manage hero banners for different pages</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Banner</DialogTitle>
              <DialogDescription>
                Add a new banner to display on your website pages.
              </DialogDescription>
            </DialogHeader>
            <BannerForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Banner
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="px-6 flex-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              All Banners
            </CardTitle>
            <CardDescription>
              Manage your website banners. Click on a banner to edit its details.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {banners.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No banners yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first banner to get started with customizing your website.
                </p>
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Banner
                </Button>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Name</TableHead>
                      <TableHead className="w-[200px]">Page</TableHead>
                      <TableHead className="text-right min-w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banners.map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell className="font-medium">{banner.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="gap-1">
                            <Eye className="w-3 h-3" />
                            {banner.page}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(banner)}
                              className="gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(banner.id)}
                              className="gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>
              Update the banner details and settings.
            </DialogDescription>
          </DialogHeader>
          <BannerForm isEdit={true} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Banner
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannerList;
