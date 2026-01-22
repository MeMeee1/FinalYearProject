
export * from './types';
import { Product, Order, CartItem } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getUserProfile() {
    return fetchWithAuth('/users/me');
}

export async function updateUserProfile(data: any) {
    return fetchWithAuth('/users/me', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}


// --- Auth Helpers ---
export function setToken(token: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
}

export function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

export function logout() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
}

export async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to login');

    if (data.token) {
        setToken(data.token);
    }
    return data;
}

export async function signup(email: string, password: string, name: string, lga?: string, address?: string, city?: string, country?: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, lga, address, city, country }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to register');
    return data;
}

export async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        // No Content-Type header needed, let browser/fetch set it with boundary
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload image');
    return data.url;
}


async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'An error occurred');
    }
    return data;
}

// --- Products ---

export async function getRecommendations(lga: string): Promise<Product[]> {
    // Ideally, passing LGA as a query param if backend supports it
    // For now, fetching all products
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to fetch products');

    // The API returns { data: Product[] } or just Product[]?
    // based on ecommerce-mobile/api/products.ts, it returns { data: Product[] }?
    // Let's verify standard return.
    // Assuming listProducts returns array or { data: ... }
    // Mobile app says: const data = await res.json(); return data; (where return type is { data: Product[] })

    return Array.isArray(data) ? data : (data.data || []);
}

export async function searchProducts(query: string = '', lga?: string, sort?: string, page: number = 1, limit: number = 10): Promise<any> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (lga && lga !== 'All') params.append('lga', lga);
    if (sort) params.append('sort', sort);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const res = await fetch(`${API_URL}/products/search?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to search products');
    return data;
}

export async function getProductCategories(): Promise<string[]> {
    const res = await fetch(`${API_URL}/products/categories`);
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to fetch categories');
    return data;
}

export async function getProduct(id: number): Promise<Product | null> {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) return null;
    return await res.json();
}

export async function getVendor(id: number): Promise<any> {
    // Parallel fetch: Vendor Details and their Products
    const [vendorRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/vendors/by-id/${id}`),
        fetch(`${API_URL}/products/seller/${id}`)
    ]);

    if (!vendorRes.ok) throw new Error('Vendor not found');
    const vendor = await vendorRes.json();

    let products = [];
    if (productsRes.ok) {
        const prodData = await productsRes.json();
        products = Array.isArray(prodData) ? prodData : (prodData.data || []);
    }

    return {
        ...vendor,
        products
    };
}

// --- Orders ---

export async function getUserOrders(): Promise<Order[]> {
    const data = await fetchWithAuth('/orders');
    return Array.isArray(data) ? data : (data.data || []);
}

export async function getOrder(id: string | number): Promise<Order> {
    return fetchWithAuth(`/orders/${id}`);
}

export async function createOrder(items: CartItem[], pickupLocation?: string) {
    // Matches ecommerce-mobile/api/orders.ts structure
    // body: { order: {}, items }
    return fetchWithAuth('/orders', {
        method: 'POST',
        body: JSON.stringify({
            order: { pickupLocation },
            items
        })
    });
}
