'use server';

import { login, signup, signupVendor } from '@/api/auth';
import { createVendor } from '@/api/vendors';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
  }
) {
  let redirectUrl = `/signUp?errorMessage=${encodeURIComponent(
    'Failed to sign up as vendor'
  )}`;
  try {
    // First, create the user account
    const res = await signupVendor(email, password);

    if (res.token) {
      cookies().set('token', res.token);

      // Then create the vendor profile
      try {
        await createVendor(vendorData, res.token);
        redirectUrl = '/login?message=' + encodeURIComponent('Vendor account created! Pending admin approval. Please login.');
      } catch (vendorError) {
        console.log('Vendor profile creation error:', vendorError);
        redirectUrl = '/login?message=' + encodeURIComponent('Account created but vendor profile setup incomplete. Please complete your profile.');
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    redirect(redirectUrl);
  }
}