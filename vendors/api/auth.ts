'use server';
import { API_URL } from '@/config';

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw Error(data.message || 'Failed to login');
  }

  if (data.user.role !== 'seller') {
    throw Error('Not authorized - vendor access required');
  }

  return data;
}

export async function logout() {

  const { cookies } = await import('next/headers');
  const { redirect } = await import('next/navigation');

  cookies().delete('token');
  redirect('/login');
}

export async function signup(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw Error(data.message || 'Failed to login');
  }
  return data;
}

export async function signupVendor(
  email: string,
  password: string,
  name: string,
  phone: string,
  address: string,
  city: string,
  country: string
) {
  const res = await fetch(`${API_URL}/auth/register/seller`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name, phone, address, city, country }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw Error(data.message || 'Failed to signup vendor');
  }
  return data;
}
