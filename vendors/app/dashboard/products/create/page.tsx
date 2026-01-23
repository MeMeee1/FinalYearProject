'use client';

import { Box } from '@/components/ui/box';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createProduct, uploadProductImage, uploadProductVideo } from '@/app/dashboard/products/actions';
import { Image as ImageIcon, Upload, X, Plus, Video, ArrowLeft, Save, Package, DollarSign, Tag, Info, Activity } from 'lucide-react';
import { z } from 'zod';
import { ChevronDown } from 'lucide-react';
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than zero'),
  stock: z.number().int().positive('Quantity must be greater than zero'),
  sku: z.string().optional(),
  productTags: z.enum(['Chicken', 'Fish', 'Eggs']).optional(),
});

export default function CreateProductPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [sku, setSku] = useState('');
  const [tag, setTag] = useState('Chicken');
  const [images, setImages] = useState<{ file?: File; preview: string }[]>([]);
  const [video, setVideo] = useState<{ file?: File; preview: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('errorMessage');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newImages].slice(0, 5));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        alert('Video size must be less than 50MB');
        e.target.value = '';
        return;
      }
      setVideo({
        file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setErrors({});
      setIsSubmitting(true);

      try {
        productSchema.parse({
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          sku: sku || undefined,
          productTags: tag as 'Chicken' | 'Fish' | 'Eggs',
        });
      } catch (err) {
        if (err instanceof z.ZodError) {
          const fieldErrors: Record<string, string> = {};
          err.issues.forEach((issue) => {
            if (issue.path[0]) {
              fieldErrors[issue.path[0].toString()] = issue.message;
            }
          });
          setErrors(fieldErrors);
          setIsSubmitting(false);
          return;
        }
      }

      const uploadedUrls: string[] = [];
      for (const img of images) {
        if (img.file) {
          const formData = new FormData();
          formData.append('image', img.file);
          const url = await uploadProductImage(formData);
          if (url) uploadedUrls.push(url);
        } else {
          uploadedUrls.push(img.preview);
        }
      }

      let videoUrl: string | undefined;
      if (video?.file) {
        const formData = new FormData();
        formData.append('video', video.file);
        const url = await uploadProductVideo(formData);
        if (url) videoUrl = url;
      }

      await createProduct(
        name,
        description,
        Number(price),
        Number(stock),
        sku,
        uploadedUrls.length > 0 ? uploadedUrls : undefined,
        videoUrl,
        tag
      );

      router.push('/dashboard/products');
      router.refresh();

    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-2xl bg-secondary/80 hover:bg-secondary transition-all flex items-center justify-center border border-border group"
              >
                <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-x-1 transition-all" />
              </button>
              <div className="h-4 w-px bg-border mx-2" />
              <div className="flex items-center gap-2">
                <Box className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </Box>
                <Text className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Inventory Hub</Text>
              </div>
            </div>
            <Heading className="text-3xl font-black tracking-tight text-foreground">Launch New Listing</Heading>
            <Text className="text-muted-foreground font-medium">Introduce a new product to your marketplace audience.</Text>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50 text-xs uppercase tracking-widest"
            >
              {isSubmitting ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSubmitting ? 'Processing...' : 'Deploy Product'}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive animate-in bounce-in">
            <Info className="w-5 h-5 shrink-0" />
            <Text className="text-xs font-bold leading-relaxed">{errorMessage}</Text>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Core Details */}
            <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <Heading className="text-xl font-black text-foreground">Item Specification</Heading>
                  <Text className="text-xs text-muted-foreground font-medium">Standard marketplace identification details.</Text>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Product Name</label>
                  <div className="relative group">
                    <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Organic Free-Range Chicken"
                      className={`w-full pl-14 pr-6 py-4 bg-secondary/30 border rounded-3xl text-sm font-bold focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none ${errors.name ? 'border-destructive/50' : 'border-border'}`}
                    />
                  </div>
                  {errors.name && <Text className="text-[10px] text-destructive font-bold ml-2">{errors.name}</Text>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe product weight, origin, quality standards..."
                    className="w-full px-6 py-6 bg-secondary/30 border border-border rounded-[2rem] text-sm font-medium focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none h-40 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Classification</label>
                  <div className="relative">
                    <select
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="w-full px-6 py-4 bg-secondary/30 border border-border rounded-2xl text-sm font-bold focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="Chicken">Poultry / Chicken</option>
                      <option value="Fish">Aquatic / Fish</option>
                      <option value="Eggs">Dairy / Eggs</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Visuals & Media */}
            <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <Heading className="text-xl font-black text-foreground">Content Gallery</Heading>
                  <Text className="text-xs text-muted-foreground font-medium">High fidelity images and demonstration videos.</Text>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Images (Max 5)</Text>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group aspect-square rounded-2xl border border-border overflow-hidden bg-secondary shadow-sm transition-all hover:border-primary/50">
                        <img src={img.preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center text-destructive opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border rounded-2xl cursor-pointer bg-secondary/30 hover:bg-primary/5 hover:border-primary transition-all group active:scale-95">
                        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} multiple />
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Demo Video (Optional)</Text>
                    <Text className="text-[10px] text-muted-foreground/60 font-bold">MAX 50 MB</Text>
                  </div>
                  {video ? (
                    <div className="relative group aspect-video bg-black rounded-[2rem] overflow-hidden border border-border">
                      <video src={video.preview} controls className="w-full h-full" />
                      <button
                        onClick={() => setVideo(null)}
                        className="absolute top-4 right-4 w-10 h-10 bg-card/80 backdrop-blur-md text-destructive rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-[2rem] cursor-pointer bg-secondary/30 hover:bg-primary/5 hover:border-primary transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all mb-3 shadow-sm">
                        <Video className="w-6 h-6 text-muted-foreground group-hover:text-primary-foreground" />
                      </div>
                      <span className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60">Upload Product Reel</span>
                      <input type="file" className="hidden" accept="video/*" onChange={handleVideoChange} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Commercials */}
            <div className="bg-card rounded-[2.5rem] border border-border p-8 space-y-8">
              <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <Heading className="text-lg font-black text-foreground">Economics</Heading>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Market Price (₦)</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-primary text-sm group-focus-within:scale-110 transition-transform">₦</div>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className={`w-full pl-12 pr-6 py-4 bg-secondary/30 border rounded-2xl text-sm font-black focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none ${errors.price ? 'border-destructive/50' : 'border-border'}`}
                    />
                  </div>
                  {errors.price && <Text className="text-[10px] text-destructive font-bold ml-2">{errors.price}</Text>}
                </div>
              </div>
            </div>

            {/* Logistics */}
            <div className="bg-card rounded-[2.5rem] border border-border p-8 space-y-8">
              <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-500" />
                </div>
                <Heading className="text-lg font-black text-foreground">Logistics</Heading>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Initial Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    className={`w-full px-6 py-4 bg-secondary/30 border rounded-2xl text-sm font-black focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none ${errors.stock ? 'border-destructive/50' : 'border-border'}`}
                  />
                  {errors.stock && <Text className="text-[10px] text-destructive font-bold ml-2">{errors.stock}</Text>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Reference SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Optional SKU..."
                    className="w-full px-6 py-4 bg-secondary/30 border border-border rounded-2xl text-sm font-bold focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 text-center">
              <Text className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-[0.2em] px-10 leading-relaxed italic">
                Deployment of this product will make it instantly visible to verified consumers.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
