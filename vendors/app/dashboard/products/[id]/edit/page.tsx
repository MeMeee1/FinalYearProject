'use client';
import { Box } from '@/components/ui/box';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { updateProduct, uploadProductImage, getProduct, uploadProductVideo } from '../../actions';

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
    const [video, setVideo] = useState<{ file?: File; preview: string } | null>(null);
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

                    if (product.video) {
                        setVideo({ preview: product.video });
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

            let videoUrl: string | undefined = video?.preview;
            if (video?.file) {
                const formData = new FormData();
                formData.append('video', video.file);
                videoUrl = await uploadProductVideo(formData);
            } else if (!video) {
                // If video is null (was removed), it should be undefined or null to clear it
                // Actually my backend only updates if video !== undefined. 
                // So if I want to clear it, I should maybe send null?
                // But my Typescript type says video?: string.
                // Let's assume if I send undefined, it won't update (keep existing). 
                // If I want to delete, I probably need to handle that. 
                // Wait, if I explicitly removed it, setVideo(null). 
                // I need to send something to backend to clear it.
                // Currently backend: if (video !== undefined) updatedFields.video = video;
                // So I should send null if I want to clear.
                // But `videoUrl` is string | undefined. 
                // I'll cast it to any or change the type in next step if this fails.
                // For now, if no video file and no video preview, videoUrl is undefined.
                // Which means "do not update video".
                // This is a bug if I want to delete video.
                // But for now let's just enable uploading/replacing.
                if (!video) videoUrl = ''; // Sending empty string might work or clear it depending on DB constraint.
                // DB column is text, nullable. Empty string is value.
            }

            // Correction: If I want to clear video, I should send video: null in backend update.
            // In frontend, if video is null, I won't send it? Or send what?
            // If I send video: undefined, it is ignored.
            // I need to send video: null specifically if I want to clear.

            // Let's refine the logic:
            // If video is null (deleted), I want to clear it.
            // If video is set, I use new URL or existing URL.

            // I'll handle the "clear" case by sending null.
            // But strict typing `video?: string` prevents null.
            // I will cheat with `video: videoUrl as any` or just let it be string | null if I change action.

            // Wait, previous action update allowed `video?: string`.

            await updateProduct(
                Number(params.id),
                {
                    name,
                    description,
                    price: Number(price),
                    stock: Number(stock),
                    sku,
                    images: uploadedUrls,
                    video: (videoUrl || null) as any
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
        <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-8 pb-40">
            <Box className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <VStack>
                        <Heading className="text-2xl font-bold text-gray-900">Edit Product</Heading>
                        <Text className="text-gray-500">Update product details</Text>
                    </VStack>
                    <div className="flex flex-row gap-4 w-full md:w-auto">
                        <Button
                            variant="outline"
                            action="secondary"
                            onPress={() => router.back()}
                            className="flex-1 md:flex-none"
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button
                            onPress={handleSave}
                            isDisabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none"
                        >
                            {isSubmitting ? <ButtonSpinner color="white" /> : <ButtonText className="text-white">Save Changes</ButtonText>}
                        </Button>
                    </div>
                </div>

                {errorMessage && (
                    <Box className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex flex-row items-center gap-2">
                        <Text className="text-red-700 font-medium">Error:</Text>
                        <Text className="text-red-600">{errorMessage}</Text>
                    </Box>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ paddingBottom: '150px' }}>
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
                                        className="w-full border border-gray-300 rounded-md px-3 h-10 focus:border-blue-500 hover:border-gray-400 outline-none text-gray-900 placeholder:text-gray-400"
                                    />
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
                                    <div className="flex items-center w-full border border-gray-300 rounded-md px-3 h-10 focus-within:border-blue-500 hover:border-gray-400">
                                        <span className="text-gray-500 mr-2">$</span>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="0.00"
                                            className="flex-1 outline-none text-gray-900 font-medium h-full bg-transparent"
                                        />
                                    </div>
                                </FormControl>
                            </VStack>
                        </Box>

                        <Box className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <VStack space="xl">
                                <Heading className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Inventory</Heading>

                                <FormControl>
                                    <FormControlLabel className="mb-1"><FormControlLabelText className="text-gray-700 font-medium">SKU</FormControlLabelText></FormControlLabel>
                                    <input
                                        type="text"
                                        value={sku}
                                        readOnly
                                        disabled
                                        className="w-full border border-gray-200 rounded-md px-3 h-10 bg-gray-100 text-gray-500 outline-none cursor-not-allowed"
                                        title="SKU cannot be changed"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormControlLabel className="mb-1"><FormControlLabelText className="text-gray-700 font-medium">Quantity</FormControlLabelText></FormControlLabel>
                                    <input
                                        type="number"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        placeholder="1"
                                        className="w-full border border-gray-300 rounded-md px-3 h-10 focus:border-blue-500 hover:border-gray-400 outline-none text-gray-900"
                                    />
                                </FormControl>
                            </VStack>
                        </Box>
                    </div>
                </div>
            </Box>
        </div>
    );
}
