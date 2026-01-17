'use server';

import { API_URL } from '@/config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export async function uploadProductImage(formData: FormData) {
    try {
        const token = cookies().get('token')?.value;
        const file = formData.get('image');
        if (!file) {
            throw new Error('No file provided');
        }

        const res = await fetch(`${API_URL}/upload/image`, {
            method: 'POST',
            headers: {
                Authorization: `${token}`,
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
        return data.url;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}

export async function createProduct(
    name: string,
    description: string,
    price: number,
    stock: number,
    sku: string,
    images?: string[]
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
            body: JSON.stringify({ name, description, price, stock, sku, images }),
        });

        if (!res.ok) {
            if (res.status === 401) {
                cookies().delete('token');
                redirectUrl = '/login';
            } else {
                const errorText = await res.text();
                console.error(`Create product failed: ${res.status} - ${errorText}`);
                throw new Error(`Failed to create product: ${errorText}`);
            }
        }
    } catch (error) {
        console.error(error);
        redirectUrl = `/dashboard/products/create?errorMessage=${encodeURIComponent('Failed to create product')}`;
    } finally {
        redirect(redirectUrl);
    }
}

export async function getProduct(id: number) {
    try {
        const token = cookies().get('token')?.value;
        const res = await fetch(`${API_URL}/products/${id}`, {
            headers: { Authorization: `${token}` }
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateProduct(
    id: number,
    data: {
        name: string;
        description: string;
        price: number;
        stock: number;
        sku: string;
        images?: string[]; // Frontend sends array of strings
        image?: string; // Or single string
    }
) {
    // Note: The backend expects 'image' (as stringified JSON) or 'images' array.
    // Our controller logic handles both. We'll send 'images' array directly if supported, or JSON string.
    // Based on my controller update: `if (images !== undefined) updatedFields.image = JSON.stringify(images);`

    // So we can send `images`.

    const token = cookies().get('token')?.value;

    // Transform arrays to what backend expects if raw JSON body
    // Actually `fetch` body stringify will keep array as array.

    const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Failed to update product');
    }

    return await res.json();
}

export async function deleteProduct(id: number) {
    const token = cookies().get('token')?.value;
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to delete product');
    }
    return true;
}
