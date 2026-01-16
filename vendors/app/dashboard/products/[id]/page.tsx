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
import { Image as ImageIcon, Upload, X, Plus, Trash } from 'lucide-react';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [sku, setSku] = useState('');
  const [status, setStatus] = useState('active');

  // Images: can be File (new) or string (existing URL)
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
              // Try parsing as JSON array
              const parsed = JSON.parse(product.image);
              if (Array.isArray(parsed)) {
                setImages(parsed.map((url: string) => ({ preview: url })));
              } else {
                setImages([{ preview: product.image }]);
              }
            } catch {
              // Fallback if not JSON
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
          // Already existing URL
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
      <Box className="flex-1 items-center justify-center">
        <ButtonSpinner color="gray" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 min-h-screen bg-gray-50 p-4 md:p-8">
      <Box className="max-w-6xl mx-auto">
        <HStack className="justify-between items-center mb-6">
          <VStack>
            <Heading className="text-2xl font-bold text-gray-900">Edit Product</Heading>
            <Text className="text-gray-500">Update product details</Text>
          </VStack>
          <HStack space="md">
            <Button
              variant="outline"
              action="secondary"
              onPress={() => router.back()}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={handleSave}
              isDisabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? <ButtonSpinner color="white" /> : <ButtonText className="text-white">Save Changes</ButtonText>}
            </Button>
          </HStack>
        </HStack>

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
                  <Input className="border-gray-300 focus:border-blue-500 hover:border-gray-400">
                    <InputField value={name} onChangeText={setName} placeholder="e.g. Premium Cotton T-Shirt" className="text-gray-900 placeholder:text-gray-400" />
                  </Input>
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
              </VStack>
            </Box>
          </div>

          <div className="space-y-6">
            <Box className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <VStack space="xl">
                <Heading className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Pricing</Heading>
                <FormControl>
                  <FormControlLabel className="mb-1"><FormControlLabelText className="text-gray-700 font-medium">Price</FormControlLabelText></FormControlLabel>
                  <Input className="border-gray-300 focus:border-blue-500 hover:border-gray-400">
                    <InputSlot className="pl-3">
                      <Text className="text-gray-500">$</Text>
                    </InputSlot>
                    <InputField value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="0.00" className="text-gray-900 font-medium" />
                  </Input>
                </FormControl>
              </VStack>
            </Box>

            <Box className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <VStack space="xl">
                <Heading className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Inventory</Heading>

                <FormControl>
                  <FormControlLabel className="mb-1"><FormControlLabelText className="text-gray-700 font-medium">SKU</FormControlLabelText></FormControlLabel>
                  <Input className="border-gray-300 focus:border-blue-500 hover:border-gray-400">
                    <InputField value={sku} onChangeText={setSku} placeholder="e.g. PROD-001" className="text-gray-900" />
                  </Input>
                </FormControl>

                <FormControl>
                  <FormControlLabel className="mb-1"><FormControlLabelText className="text-gray-700 font-medium">Quantity</FormControlLabelText></FormControlLabel>
                  <Input className="border-gray-300 focus:border-blue-500 hover:border-gray-400">
                    <InputField value={stock} onChangeText={setStock} keyboardType="numeric" placeholder="1" className="text-gray-900" />
                  </Input>
                </FormControl>
              </VStack>
            </Box>
          </div>
        </div>
      </Box>
    </Box>
  );
}
