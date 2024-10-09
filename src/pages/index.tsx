// App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import Fans from '../components/Fans';
import Users from '../components/Users'
import Listeners from '../components/Listeners';
import Sessions from '../components/Sessions';
import Analytics from '../components/Analytics';
import Settings from '../components/Settings';  // Import the Analytics component

const App: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // This will only run on the client-side
  }, []);

  if (!isMounted) {
    return null; // Render nothing on the server
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fans" element={<Fans />} />
            <Route path="/users" element={<Users />} />
            <Route path="/listeners" element={<Listeners />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} /> {/* Add the new route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
