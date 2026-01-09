import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

/**
 * Render the admin panel root with a welcome header and authentication-aware controls.
 *
 * Renders a heading and shows a modal SignInButton when the user is signed out, or a UserButton when signed in.
 *
 * @returns {JSX.Element} The root JSX element for the admin panel.
 */
function App() {
  return (
    <div>
      <h1>Welcome to the Admin Panel</h1>
   <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      </div>
  )
}

export default App