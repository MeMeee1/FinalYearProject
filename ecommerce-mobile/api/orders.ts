import { useAuth } from '@/store/authStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createOrder(items: any[]) {
  const token = useAuth.getState().token;

  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    body: JSON.stringify({ order: {}, items }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.log(data);
    throw new Error('Error');
  }

  return data;
}

export async function listOrders() {
  const token = useAuth.getState().token;

  const res = await fetch(`${API_URL}/orders`, {
    headers: {
      Authorization: token || '',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error('Error fetching orders');
  }

  return data;
}

export async function getOrder(id: number) {
  const token = useAuth.getState().token;

  const res = await fetch(`${API_URL}/orders/${id}`, {
    headers: {
      Authorization: token || '',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error('Error fetching order');
  }

  return data;
}
