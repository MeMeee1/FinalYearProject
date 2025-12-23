import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import NotFound from './NotFound';

function App() {
  return (
    <Router>
      <div>
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>

        <Routes>
        
          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
