'use server';

import { API_URL } from '@/config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export async function uploadProductImage(formData: FormData) {
  try {
    const token = cookies().get('token')?.value;
    // We send to our API's /upload/image endpoint
    // We can assume the input name in formData is 'image'

    // Check if formData deals with file correctly in server actions (Next.js 14 supports it)
    const file = formData.get('image');
    if (!file) {
      throw new Error('No file provided');
    }

    const res = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      headers: {
        Authorization: `${token}`,
        // Note: When sending FormData with fetch, do NOT set Content-Type header manually.
        // The browser/runtime sets it with the boundary.
      },
      body: formData,
    });

    if (!res.ok) {
      console.error('Upload failed with status:', res.status);
      const text = await res.text();
      console.error('Response:', text);
      throw new Error(`Upload failed: ${res.status}`);
    }

    const data = await res.json();
    return data.url; // The API returns { url: string, ... }
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export async function createProduct(
  name: string,
  description: string,
  price: number,
  image?: string
) {
  let redirectUrl = '/dashboard/products';
  try {
    const token = cookies().get('token')?.value;

    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, price, image }),
    });

    if (!res.ok) {
      console.log(res);
      if (res.status === 401) {
        cookies().delete('token');
        redirectUrl = '/login';
      } else {
        throw new Error('Failed to create product: ');
      }
    }
  } catch (error) {
    redirectUrl = `/dashboard/products/create?errorMessage=${encodeURIComponent(
      'Failed to create product'
    )}`;
  } finally {
    redirect(redirectUrl);
  }
}
