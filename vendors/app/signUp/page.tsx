'use client';
import { FormControl } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { useState } from 'react';
import { Box } from '@/components/ui/box';
import { login, signup } from '@/api/auth';
import { handleLogin, handleSignup, handleVendorSignup } from './actions';
import { useSearchParams } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('errorMessage');

  const handleSubmit = () => {
    const vendorData = {
      storeName,
      storeDescription: storeDescription || undefined,
      businessName: businessName || undefined,
      businessAddress: businessAddress || undefined,
      businessEmail: businessEmail || undefined,
      businessPhone: businessPhone || undefined,
    };
    handleVendorSignup(email, password, vendorData);
  };

  return (
    <Box className="flex-1 min-h-screen justify-center items-center">
      <FormControl
        isInvalid={!!errorMessage}
        className="p-4 border rounded-lg max-w-[500px] w-full border-outline-300 bg-white m-2"
      >
        <VStack space="xl">
          <Heading className="text-typography-900 leading-3 pt-3">
            Vendor Sign Up
          </Heading>
          <VStack space="xs">
            <Text className="text-typography-500 leading-1">Email</Text>
            <Input>
              <InputField value={email} onChangeText={setEmail} type="text" />
            </Input>
          </VStack>
          <VStack space="xs">
            <Text className="text-typography-500 leading-1">Password</Text>
            <Input className="text-center">
              <InputField
                value={password}
                onChangeText={setPassword}
                type="password"
              />
            </Input>
          </VStack>
          
          <VStack space="xs">
            <Text className="text-typography-500 leading-1">Store Name *</Text>
            <Input>
              <InputField value={storeName} onChangeText={setStoreName} type="text" />
            </Input>
          </VStack>
          
          <VStack space="xs">
            <Text className="text-typography-500 leading-1">Store Description</Text>
            <Input>
              <InputField 
                value={storeDescription} 
                onChangeText={setStoreDescription} 
                type="text"
                placeholder="Brief description of your store"
              />
            </Input>
          </VStack>
          
          <VStack space="xs">
            <Text className="text-typography-500 leading-1">Business Name</Text>
            <Input>
              <InputField value={businessName} onChangeText={setBusinessName} type="text" />
            </Input>
          </VStack>
          
          <VStack space="xs">
            <Text className="text-typography-500 leading-1">Business Address</Text>
            <Input>
              <InputField value={businessAddress} onChangeText={setBusinessAddress} type="text" />
            </Input>
          </VStack>
          
          <VStack space="xs">
            <Text className="text-typography-500 leading-1">Business Email</Text>
            <Input>
              <InputField value={businessEmail} onChangeText={setBusinessEmail} type="text" />
            </Input>
          </VStack>
          
          <VStack space="xs">
            <Text className="text-typography-500 leading-1">Business Phone</Text>
            <Input>
              <InputField value={businessPhone} onChangeText={setBusinessPhone} type="text" />
            </Input>
          </VStack>
          
          {errorMessage && <Text className="text-red-500">{errorMessage}</Text>}
          <Button
            className="w-full"
            onPress={handleSubmit}
          >
            <ButtonText>Sign up as Vendor</ButtonText>
          </Button>
          <Text className="text-typography-500 text-sm text-center">
            Your vendor account will be pending admin approval after registration.
          </Text>
        </VStack>
      </FormControl>
    </Box>
  );
}
