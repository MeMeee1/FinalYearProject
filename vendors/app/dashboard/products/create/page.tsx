'use client';
import { Box } from '@/components/ui/box';
import { FormControl } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { createProduct, uploadProductImage } from './actions';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function CreateProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('errorMessage');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);

      let imageUrl = undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        // We can specify a folder if we want, handled in backend or just use default
        // formData.append('folder', 'products'); 

        const uploadedUrl = await uploadProductImage(formData);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          alert('Failed to upload image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      await createProduct(name, description, Number(price), imageUrl);
      // createProduct handles redirect
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="flex-1 min-h-screen justify-center items-center">
      <FormControl
        isInvalid={!!errorMessage}
        className="p-4 border rounded-lg max-w-[500px] w-full border-outline-300 bg-white m-2"
      >
        <VStack space="xl">
          <Heading className="text-typography-900 leading-3 pt-3">
            Create product
          </Heading>

          <VStack space="xs">
            <Text className="text-typography-500 leading-1">Product Image</Text>
            <div className="flex flex-col gap-2">
              {imagePreview ? (
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <Upload className="w-4 h-4 rotate-45" /> {/* Use X icon if available, or rotate upload/plus */}
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </VStack>

          <VStack space="xs">
            <Text className="text-typography-500 leading-1">Name</Text>
            <Input>
              <InputField value={name} onChangeText={setName} type="text" />
            </Input>
          </VStack>

          <VStack space="xs">
            <Text className="text-typography-500 leading-1">Description</Text>
            <Input>
              <InputField
                value={description}
                onChangeText={setDescription}
                type="text"
              />
            </Input>
          </VStack>

          <VStack space="xs">
            <Text className="text-typography-500 leading-1">Price</Text>
            <Input>
              <InputField value={price} onChangeText={setPrice} type="text" />
            </Input>
          </VStack>

          {errorMessage && <Text className="text-red-500">{errorMessage}</Text>}
          <Button
            onPress={handleSave}
            isDisabled={isSubmitting}
          >
            {isSubmitting ? <ButtonSpinner /> : <ButtonText>Save product</ButtonText>}
          </Button>
        </VStack>
      </FormControl>
    </Box>
  );
}
