const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function listProducts(page = 1, limit = 12) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  const res = await fetch(`${API_URL}/products/?${params.toString()}`,{
   cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error('Error');
  }
  console.log('Product list data:', data);
  return data; 
}
export async function searchProducts(query: string, page = 1, limit = 5) {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString(),
  });
  
  const res = await fetch(`${API_URL}/products/search?${params.toString()}`, {
    cache: 'no-store'
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error('Error searching products');
  }
  return data;
}
export async function fetchProductById(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error('Error');
  }
  return data;
}
