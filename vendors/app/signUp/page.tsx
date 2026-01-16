'use client';

import { useState, useRef } from 'react';
import { z } from 'zod';
import { handleVendorSignup } from './actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, X } from 'lucide-react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabelText as FormControlLabelTextOriginal
} from '@/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { AlertCircleIcon } from '@/components/ui/icon';
import { API_URL } from '@/config';

type FormData = {
  email: string;
  password: string;
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  storeName: string;
  storeDescription: string;
  storeLogo: string;
  storeBanner: string;
};

const step1Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const step2Schema = z.object({
  businessName: z.string().min(2),
  businessAddress: z.string().min(5),
  businessEmail: z.string().email(),
  businessPhone: z.string().min(10),
});

const step3Schema = z.object({
  storeName: z.string().min(2),
  storeDescription: z.string().min(10),
  storeLogo: z.string().url().optional().or(z.literal('')),
  storeBanner: z.string().url().optional().or(z.literal('')),
});

const ImageUploadField = ({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      // Optional: Add folder param if you want specific organization in Cloudinary
      // formData.append('folder', 'vendor-assets');

      const res = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
      // Reset input so same file can be selected again if needed
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Box className="border border-gray-300 rounded-md p-4 items-center justify-center border-dashed bg-gray-50 h-32 overflow-hidden">
        {value ? (
          <Box className="relative w-full h-full justify-center items-center">
            {/* Using standard img tag for web preview simplification. 
                In a purely Native environment, use <Image source={{ uri: value }} ... /> from react-native */}
            <img
              src={value}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            <Button
              size="xs"
              action="negative"
              onPress={() => onChange('')}
              className="absolute -top-3 -right-3 rounded-full p-1 h-8 w-8 z-10"
            >
              <ButtonIcon as={X} />
            </Button>
          </Box>
        ) : (
          <Button
            variant="outline"
            action="secondary"
            onPress={() => inputRef.current?.click()}
            isDisabled={loading}
          >
            <ButtonText>{loading ? 'Uploading...' : 'Upload Image'}</ButtonText>
          </Button>
        )}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
      </Box>
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>{error}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};


const step4Schema = z.object({
  productName: z.string().min(2),
  productDescription: z.string().min(10),
  productPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"), // Validate as string first
  productStock: z.string().regex(/^\d+$/, "Must be a whole number"),
  productSku: z.string().optional(),
  productImage: z.string().url().optional().or(z.literal('')),
});

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const searchParams = useSearchParams();
  const serverError = searchParams.get('errorMessage');

  const [formData, setFormData] = useState<FormData & {
    productName: string;
    productDescription: string;
    productPrice: string;
    productStock: string;
    productSku: string;
    productImage: string;
  }>({
    email: '',
    password: '',
    businessName: '',
    businessAddress: '',
    businessEmail: '',
    businessPhone: '',
    storeName: '',
    storeDescription: '',
    storeLogo: '',
    storeBanner: '',
    productName: '',
    productDescription: '',
    productPrice: '',
    productStock: '0',
    productSku: '',
    productImage: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validateStep = (s: number) => {
    try {
      if (s === 1) step1Schema.parse(formData);
      if (s === 2) step2Schema.parse(formData);
      if (s === 3) step3Schema.parse(formData);
      if (s === 4) step4Schema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const mapped: Record<string, string> = {};
        err.issues.forEach((i) => {
          mapped[String(i.path[0])] = i.message;
        });
        setErrors(mapped);
      }
      return false;
    }
  };

  const [showProductModal, setShowProductModal] = useState(false);

  const handleSubmit = async (includeProduct: boolean) => {
    if (includeProduct && !validateStep(4)) return;

    const vendorData = {
      businessName: formData.businessName,
      businessAddress: formData.businessAddress,
      businessEmail: formData.businessEmail,
      businessPhone: formData.businessPhone,
      storeName: formData.storeName,
      storeDescription: formData.storeDescription,
      storeLogo: formData.storeLogo,
      storeBanner: formData.storeBanner,
    };

    let productData;
    if (includeProduct) {
      productData = {
        name: formData.productName,
        description: formData.productDescription,
        price: parseFloat(formData.productPrice),
        stock: parseInt(formData.productStock),
        sku: formData.productSku,
        image: formData.productImage,
      };
    }

    const result = await handleVendorSignup(formData.email, formData.password, vendorData, productData);

    if (result?.error) {
      setErrors((prev) => ({ ...prev, email: result.error }));
      alert(result.error);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative">
      <Box className="w-full max-w-md bg-white p-6 rounded-xl border border-gray-200">

        {/* Progress bar */}
        <Box className="mb-6">
          <Progress value={(step / 3) * 100} className="w-full h-2">
            <ProgressFilledTrack className="bg-blue-600" />
          </Progress>
        </Box>

        {step === 1 && (
          <VStack space="md">
            <Heading className="text-xl font-semibold mb-2">Account Credentials</Heading>

            <FormControl isInvalid={!!errors.email}>
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(text: string) => updateField('email', text)}
                />
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>{errors.email}</FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormControlLabel>
                <FormControlLabelText>Password</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(text: string) => updateField('password', text)}
                />
                <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                  <InputIcon as={showPassword ? Eye : EyeOff} className="text-gray-500" />
                </InputSlot>
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>{errors.password}</FormControlErrorText>
              </FormControlError>
            </FormControl>

            <Button
              className="mt-4"
              onPress={() => validateStep(1) && setStep(2)}
            >
              <ButtonText>Next</ButtonText>
              <ButtonIcon as={ArrowRight} />
            </Button>
          </VStack>
        )}

        {step === 2 && (
          <VStack space="md">
            <Heading className="text-xl font-semibold mb-2">Business Details</Heading>

            {['businessName', 'businessAddress', 'businessEmail', 'businessPhone'].map(
              (f) => (
                <FormControl key={f} isInvalid={!!errors[f]}>
                  <FormControlLabel>
                    <FormControlLabelText className="capitalize">
                      {f.replace(/([A-Z])/g, ' $1')}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder={f.replace(/([A-Z])/g, ' $1')}
                      value={(formData as any)[f]}
                      onChangeText={(text: string) => updateField(f, text)}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>{errors[f]}</FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )
            )}

            <HStack space="md" className="mt-4">
              <Button variant="outline" action="secondary" onPress={() => setStep(1)} className="flex-1">
                <ButtonIcon as={ArrowLeft} />
                <ButtonText>Back</ButtonText>
              </Button>
              <Button
                className="flex-1"
                onPress={() => validateStep(2) && setStep(3)}
              >
                <ButtonText>Next</ButtonText>
                <ButtonIcon as={ArrowRight} />
              </Button>
            </HStack>
          </VStack>
        )}

        {step === 3 && (
          <VStack space="md">
            <Heading className="text-xl font-semibold mb-2">Store Setup</Heading>

            {/* Text fields for Store Name and Description */}
            {['storeName', 'storeDescription'].map(
              (f) => (
                <FormControl key={f} isInvalid={!!errors[f]}>
                  <FormControlLabel>
                    <FormControlLabelText className="capitalize">
                      {f.replace(/([A-Z])/g, ' $1')}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder={f.replace(/([A-Z])/g, ' $1')}
                      value={(formData as any)[f]}
                      onChangeText={(text: string) => updateField(f, text)}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>{errors[f]}</FormControlErrorText>
                  </FormControlError>
                </FormControl>
              )
            )}

            {/* Image Upload for Logo */}
            <ImageUploadField
              label="Store Logo"
              value={formData.storeLogo}
              onChange={(url) => updateField('storeLogo', url)}
              error={errors.storeLogo}
            />

            {/* Image Upload for Banner */}
            <ImageUploadField
              label="Store Banner"
              value={formData.storeBanner}
              onChange={(url) => updateField('storeBanner', url)}
              error={errors.storeBanner}
            />

            <HStack space="md" className="mt-4">
              <Button variant="outline" action="secondary" onPress={() => setStep(2)} className="flex-1">
                <ButtonIcon as={ArrowLeft} />
                <ButtonText>Back</ButtonText>
              </Button>
              <Button className="flex-1" onPress={() => validateStep(3) && setShowProductModal(true)}>
                <ButtonText>Complete Signup</ButtonText>
                <ButtonIcon as={ArrowRight} />
              </Button>
            </HStack>
          </VStack>
        )}

        {serverError && (
          <Box className="mt-4 p-3 bg-red-100 rounded-md border border-red-200">
            <Text className="text-red-700">{serverError}</Text>
          </Box>
        )}
      </Box>

      {/* Product Creation Modal */}
      {showProductModal && (
        <Box className="absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Box className="w-full max-w-md bg-white p-6 rounded-xl border border-gray-200 shadow-xl">
            <HStack className="justify-between items-center mb-4">
              <Heading className="text-xl font-semibold">Add Your First Product</Heading>
              <Button size="xs" variant="link" onPress={() => setShowProductModal(false)}>
                <ButtonIcon as={X} className="text-gray-500" />
              </Button>
            </HStack>

            <Text className="text-gray-500 mb-4">Start selling immediately by adding a product now or skip for later.</Text>

            <VStack space="md">
              <FormControl isInvalid={!!errors.productName}>
                <FormControlLabel><FormControlLabelText>Product Name</FormControlLabelText></FormControlLabel>
                <Input><InputField placeholder="e.g. Handmade T-Shirt" value={formData.productName} onChangeText={(t: string) => updateField('productName', t)} /></Input>
                <FormControlError><FormControlErrorIcon as={AlertCircleIcon} /><FormControlErrorText>{errors.productName}</FormControlErrorText></FormControlError>
              </FormControl>

              <FormControl isInvalid={!!errors.productDescription}>
                <FormControlLabel><FormControlLabelText>Description</FormControlLabelText></FormControlLabel>
                <Input><InputField placeholder="Describe your product..." value={formData.productDescription} onChangeText={(t: string) => updateField('productDescription', t)} /></Input>
                <FormControlError><FormControlErrorIcon as={AlertCircleIcon} /><FormControlErrorText>{errors.productDescription}</FormControlErrorText></FormControlError>
              </FormControl>

              <HStack space="md">
                <FormControl className="flex-1" isInvalid={!!errors.productPrice}>
                  <FormControlLabel><FormControlLabelText>Price</FormControlLabelText></FormControlLabel>
                  <Input><InputField placeholder="0.00" keyboardType="numeric" value={formData.productPrice} onChangeText={(t: string) => updateField('productPrice', t)} /></Input>
                  <FormControlError><FormControlErrorIcon as={AlertCircleIcon} /><FormControlErrorText>{errors.productPrice}</FormControlErrorText></FormControlError>
                </FormControl>

                <FormControl className="flex-1" isInvalid={!!errors.productStock}>
                  <FormControlLabel><FormControlLabelText>Quantity / Stock</FormControlLabelText></FormControlLabel>
                  <Input><InputField placeholder="1" keyboardType="numeric" value={formData.productStock} onChangeText={(t: string) => updateField('productStock', t)} /></Input>
                  <FormControlError><FormControlErrorIcon as={AlertCircleIcon} /><FormControlErrorText>{errors.productStock}</FormControlErrorText></FormControlError>
                </FormControl>
              </HStack>

              <FormControl isInvalid={!!errors.productSku}>
                <FormControlLabel>
                  <FormControlLabelText>SKU (Stock Keeping Unit)</FormControlLabelText>
                </FormControlLabel>
                <Input><InputField placeholder="e.g. TSHIRT-001" value={formData.productSku} onChangeText={(t: string) => updateField('productSku', t)} /></Input>
                <Text className="text-xs text-gray-500 mt-1">Unique ID for inventory management (Optional)</Text>
              </FormControl>

              <ImageUploadField
                label="Product Image"
                value={formData.productImage}
                onChange={(url) => updateField('productImage', url)}
                error={errors.productImage}
              />

              <HStack space="md" className="mt-4">
                <Button variant="outline" action="secondary" onPress={() => handleSubmit(false)} className="flex-1">
                  <ButtonText>Skip This</ButtonText>
                </Button>
                <Button className="flex-1" onPress={() => handleSubmit(true)}>
                  <ButtonText>Save & Finish</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
