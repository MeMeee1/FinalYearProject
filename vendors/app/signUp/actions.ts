'use server';
import { login, signup, signupVendor } from '@/api/auth';
import { createVendor } from '@/api/vendors';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createProduct } from '@/api/products';

export async function handleLogin(email: string, password: string) {
  let redirectUrl = `/login?errorMessage=${encodeURIComponent(
    'Failed to login, Check Credentials'
  )}`;
  try {
    const res = await login(email, password);

    if (res.token) {
      cookies().set('token', res.token);
      redirectUrl = '/dashboard';
    }
  } catch (error) {
    console.log(error);
  } finally {
    redirect(redirectUrl);
  }
}

export async function handleSignup(email: string, password: string) {
  let redirectUrl = `/login?errorMessage=${encodeURIComponent(
    'Failed to sign up'
  )}`;
  try {
    const res = await signup(email, password);

    if (res.token) {
      cookies().set('token', res.token);
      redirectUrl = '/dashboard';
    }
  } catch (error) {
    console.log(error);
  } finally {
    redirect(redirectUrl);
  }
}

export async function handleVendorSignup(
  email: string,
  password: string,
  vendorData: {
    storeName: string;
    storeDescription?: string;
    storeLogo?: string;
    storeBanner?: string;
    businessName?: string;
    businessAddress?: string;
    businessEmail?: string;
    businessPhone?: string;
    city?: string;
    country?: string;
  },
  productData?: {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    sku?: string;
  }
) {
  let redirectUrl: string | null = null;

  try {
    // First, create the user account
    const res = await signupVendor(email, password);

    if (res.token) {
      cookies().set('token', res.token);

      // Then create the vendor profile
      try {
        await createVendor(vendorData, res.token);

        // If product data is provided, create the product
        if (productData) {
          try {
            await createProduct({
              name: productData.name,
              description: productData.description,
              price: productData.price,
              stock: productData.stock,
              images: productData.image ? [productData.image] : [],
              sku: productData.sku,
            });
            redirectUrl = '/login?message=' + encodeURIComponent('Vendor account and first product created! Pending admin approval. Please login.');
          } catch (productError) {
            console.log('Product creation error:', productError);
            // Still redirect to login but warn about product
            redirectUrl = '/login?message=' + encodeURIComponent('Account created but product failed to save. Please login and add it manually.');
          }
        } else {
          redirectUrl = '/login?message=' + encodeURIComponent('Vendor account created! Pending admin approval. Please login.');
        }

      } catch (vendorError) {
        console.log('Vendor profile creation error:', vendorError);
        redirectUrl = '/login?message=' + encodeURIComponent('Account created but vendor profile setup incomplete. Please complete your profile.');
      }
    }
  } catch (error) {
    console.log('Signup error:', error);
    // Return the error to the client instead of redirecting
    return { error: error instanceof Error ? error.message : 'Failed to sign up' };
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}