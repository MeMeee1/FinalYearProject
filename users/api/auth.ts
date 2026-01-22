'use server';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log(data);
  if(data.user.role !== 'admin') {
    throw Error('Not authorized');
  }
  if (!res.ok) {
    console.log(data);
    throw Error('Failed to login');
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
    throw Error('Failed to login');
  }
  return data;
}
