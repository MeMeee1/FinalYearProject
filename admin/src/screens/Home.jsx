import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to the Admin Panel</h1>

      <SignedOut>
        <p>You are not signed in.</p>
        <SignInButton mode="modal">
          <button style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }}>
            Sign In
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <p>You are signed in.</p>
        <UserButton />
      </SignedIn>
    </div>
  );
}
