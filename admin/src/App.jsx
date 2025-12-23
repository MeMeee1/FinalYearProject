import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NotFound from './components/NotFound';
import Home from './screens/Home';

function App() {
  return (
    <Router>
      <div>
        

        <Routes>
          <Route path="/" element={<Home />} />
          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
