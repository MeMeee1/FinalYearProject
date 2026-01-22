const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Product {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  stock: number;
  sku: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  sellerId: number;
  video: string | null;
  vendor?: {
    id: number;
    storeName: string;
    storeDescription: string | null;
    businessAddress: string | null;
  };
}

export async function listProducts(): Promise<{ data: Product[] }> {
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error('Error');
  }
  return data;
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error('Error');
  }
  return data;
}

export async function searchProducts(query: string): Promise<{ data: Product[] }> {
  const res = await fetch(`${API_URL}/products/search?q=${query}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error('Error');
  }
  return data;
}