'use client';
import { Box } from '@/components/ui/box';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { createProduct, uploadProductImage, uploadProductVideo } from '@/app/dashboard/products/actions';
import { Image as ImageIcon, Upload, X, Plus, Video } from 'lucide-react';

import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than zero'),
  stock: z.number().int().positive('Quantity must be greater than zero'),
  sku: z.string().optional(),
});

export default function CreateProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [sku, setSku] = useState('');
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

      // Check for file size (50MB = 50 * 1024 * 1024 bytes)
      if (file.size > 50 * 1024 * 1024) {
        alert('Video size must be less than 50MB');
        e.target.value = ''; // Clear file input
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

      // Validate inputs
      try {
        productSchema.parse({
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          sku: sku || undefined,
        });
      } catch (err) {
        if (err instanceof z.ZodError) {
          const fieldErrors: Record<string, string> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any).errors.forEach((error: any) => {
            if (error.path[0]) {
              fieldErrors[error.path[0].toString()] = error.message;
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
        videoUrl
      );
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-8 pb-40">
      <Box className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <VStack>
            <Heading className="text-2xl font-bold text-gray-900">Create Product</Heading>
            <Text className="text-gray-500">Add a new product to your store</Text>
          </VStack>
          <Button
            onPress={handleSave}
            isDisabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
          >
            {isSubmitting ? <ButtonSpinner color="white" /> : <ButtonText className="text-white">Save Product</ButtonText>}
          </Button>
        </div>

        {errorMessage && (
          <Box className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex flex-row items-center gap-2">
            <Text className="text-red-700 font-medium">Error:</Text>
            <Text className="text-red-600">{errorMessage}</Text>
          </Box>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Box className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <VStack space="xl">
                <Heading className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Product Details</Heading>

                <FormControl>
                  <FormControlLabel className="mb-1"><FormControlLabelText className="text-gray-700 font-medium">Name</FormControlLabelText></FormControlLabel>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Premium Cotton T-Shirt"
                    className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 h-10 focus:border-blue-500 hover:border-gray-400 outline-none text-gray-900 placeholder:text-gray-400`}
                  />
                  {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>}
                </FormControl>

                <FormControl>
                  <FormControlLabel className="mb-1"><FormControlLabelText className="text-gray-700 font-medium">Description</FormControlLabelText></FormControlLabel>
                  <Box className="h-32 w-full border border-gray-300 rounded-md overflow-hidden focus-within:border-blue-500 hover:border-gray-400">
                    <textarea
                      className="w-full h-full p-3 outline-none resize-none text-gray-900 placeholder:text-gray-400 text-sm font-sans"
                      placeholder="Describe your product features, materials, etc..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Box>
                </FormControl>
              </VStack>
            </Box>

            <Box className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <VStack space="xl">
                <Heading className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Media</Heading>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={img.preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-white/90 text-red-600 p-1 rounded-full shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200">
                      <Plus className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500 font-medium">Add Image</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} multiple />
                    </label>
                  )}
                </div>
                <Text className="text-xs text-gray-500 mt-2">Add up to 5 images.</Text>

                <Box className="mt-6 border-t border-gray-100 pt-4">
                  <Heading className="text-sm font-semibold text-gray-900 mb-2">Product Video</Heading>
                  {video ? (
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-200 group">
                      <video src={video.preview} controls className="w-full h-full" />
                      <button
                        onClick={() => setVideo(null)}
                        className="absolute top-2 right-2 bg-white/90 text-red-600 p-2 rounded-full shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 font-medium">Upload Video</span>
                      <span className="text-xs text-gray-400 mt-1">Max 50MB</span>
                      <input type="file" className="hidden" accept="video/*" onChange={handleVideoChange} />
                    </label>
                  )}
                </Box>
              </VStack>
            </Box>
          </div>

          <div className="space-y-6">
            <Box className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <VStack space="xl">
                <Heading className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Pricing</Heading>
                <FormControl>
                  <FormControlLabel className="mb-1"><FormControlLabelText className="text-gray-700 font-medium">Price</FormControlLabelText></FormControlLabel>
                  <div className={`flex items-center w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 h-10 focus-within:border-blue-500 hover:border-gray-400`}>
                    <span className="text-gray-500 mr-2">$</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 outline-none text-gray-900 font-medium h-full bg-transparent"
                    />
                  </div>
                  {errors.price && <Text className="text-red-500 text-xs mt-1">{errors.price}</Text>}
                </FormControl>
              </VStack>
            </Box>

            <Box className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <VStack space="xl">
                <Heading className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Inventory</Heading>

                <FormControl>
                  <FormControlLabel className="mb-1"><FormControlLabelText className="text-gray-700 font-medium">SKU (Optional)</FormControlLabelText></FormControlLabel>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Auto-generated if empty"
                    className="w-full border border-gray-300 rounded-md px-3 h-10 focus:border-blue-500 hover:border-gray-400 outline-none text-gray-900 bg-gray-50"
                  />
                  <Text className="text-xs text-gray-500 mt-1">Leave empty to auto-generate.</Text>
                </FormControl>

                <FormControl>
                  <FormControlLabel className="mb-1"><FormControlLabelText className="text-gray-700 font-medium">Quantity</FormControlLabelText></FormControlLabel>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="1"
                    className={`w-full border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 h-10 focus:border-blue-500 hover:border-gray-400 outline-none text-gray-900`}
                  />
                  {errors.stock && <Text className="text-red-500 text-xs mt-1">{errors.stock}</Text>}
                </FormControl>
              </VStack>
            </Box>
          </div>
        </div>
      </Box>
    </div>
  );
}
