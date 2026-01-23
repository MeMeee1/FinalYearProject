'use client';

import { Box } from '@/components/ui/box';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { updateProduct, uploadProductImage, getProduct } from '../actions';
import { Image as ImageIcon, Upload, X, Plus, Trash, ArrowLeft, Save, Package, DollarSign, Tag, Info, Activity } from 'lucide-react';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [sku, setSku] = useState('');
  const [status, setStatus] = useState('active');

  const [images, setImages] = useState<{ file?: File; preview: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('errorMessage');

  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await getProduct(Number(params.id));
        if (product) {
          setName(product.name);
          setDescription(product.description || '');
          setPrice(String(product.price));
          setStock(String(product.stock));
          setSku(product.sku || '');
          setStatus(product.status || 'active');

          if (product.image) {
            try {
              const parsed = JSON.parse(product.image);
              if (Array.isArray(parsed)) {
                setImages(parsed.map((url: string) => ({ preview: url })));
              } else {
                setImages([{ preview: product.image }]);
              }
            } catch {
              setImages([{ preview: product.image }]);
            }
          }
        } else {
          alert('Product not found');
          router.push('/dashboard/products');
        }
      } catch (error) {
        console.error('Failed to load product', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [params.id, router]);

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

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
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

      await updateProduct(
        Number(params.id),
        {
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          sku,
          images: uploadedUrls
        }
      );

      router.push('/dashboard/products');
      router.refresh();

    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <Text className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Accessing Inventory...</Text>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Superior Header */}
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
                  <Tag className="w-4 h-4 text-primary" />
                </Box>
                <Text className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Listing Editor</Text>
              </div>
            </div>
            <Heading className="text-3xl font-black tracking-tight text-foreground">Edit <span className="text-primary">{name || 'Listing'}</span></Heading>
            <Text className="text-muted-foreground font-medium">Refine your product information and assets.</Text>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50 text-xs uppercase tracking-widest"
            >
              {isSubmitting ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSubmitting ? 'Syncing...' : 'Save Changes'}
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
            {/* Primary Details Card */}
            <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <Heading className="text-xl font-black text-foreground">Core Information</Heading>
                  <Text className="text-xs text-muted-foreground font-medium">Public details visible on the marketplace.</Text>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Display Name</label>
                  <div className="relative group">
                    <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter product title..."
                      className="w-full pl-14 pr-6 py-4 bg-secondary/30 border border-border rounded-3xl text-sm font-bold focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Marketplace Narrative</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed description of your product..."
                    className="w-full px-6 py-6 bg-secondary/30 border border-border rounded-[2rem] text-sm font-medium focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none h-40 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Media/Gallery Card */}
            <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <Heading className="text-xl font-black text-foreground">Visual Assets</Heading>
                  <Text className="text-xs text-muted-foreground font-medium">Manage up to 5 high-quality product images.</Text>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group aspect-square rounded-2xl border border-border overflow-hidden bg-secondary shadow-sm transition-all hover:border-primary/50">
                    <img src={img.preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center text-destructive opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90"
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
                    <span className="text-[10px] font-black text-muted-foreground mt-3 uppercase tracking-widest opacity-60">Add Media</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} multiple />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Economic Card */}
            <div className="bg-card rounded-[2.5rem] border border-border p-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <Heading className="text-lg font-black text-foreground">Commerce</Heading>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Market Price (₦)</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-primary text-sm group-focus-within:scale-110 transition-transform">₦</div>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-6 py-4 bg-secondary/30 border border-border rounded-2xl text-sm font-black focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Logistics Card */}
            <div className="bg-card rounded-[2.5rem] border border-border p-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-500" />
                </div>
                <Heading className="text-lg font-black text-foreground">Logistics</Heading>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Stock Inventory</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    className="w-full px-6 py-4 bg-secondary/30 border border-border rounded-2xl text-sm font-black focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Stock Keeping Unit (SKU)</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Uniquely identifier..."
                    className="w-full px-6 py-4 bg-secondary/30 border border-border rounded-2xl text-sm font-bold focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* System Context */}
            <div className="pt-4 text-center">
              <Text className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-[0.2em]">Listing ID: {params.id}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
