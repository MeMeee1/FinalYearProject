// products.ts - Updated version
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function listProducts(page = 1, limit = 8) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const res = await fetch(`${API_URL}/products/?${params.toString()}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    
    const data = await res.json();
    return data; 
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function searchProducts(query: string, page = 1, limit = 8) {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const res = await fetch(`${API_URL}/products/search?${params.toString()}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

export async function fetchProductById(id: number) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function getProductsByVendor(vendorId: number | string, page = 1, limit = 20) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const res = await fetch(`${API_URL}/products/seller/${vendorId}?${params.toString()}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    throw error;
  }
}