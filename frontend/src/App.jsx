import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Home from './pages/Home';
import Login from './pages/Login';
import DonorForm from './components/donor-form';
import RecipientDashboard from './pages/RecipientDashboard';

// const RecipientMap = () => (
//   <div className="p-24 text-center">
//     <h2 className="text-2xl font-bold">Recipient Map View</h2>
//     <p className="text-slate-500 mt-2">Map engine coming soon...</p>
//   </div>
// );

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500 font-medium bg-slate-50">
        Loading SurplusShare...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Main Home Page Route - We pass down the session state here */}
        <Route path="/" element={<Home session={session} />} />
        
        {/* Unified Sign In / Sign Up Custom Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Donor Dashboard Route */}
        <Route 
          path="/donor" 
          element={session ? <DonorForm session={session} /> : <Navigate to="/login" />} 
        />
        
        {/* Recipient Route */}
        <Route path="/recipient" element={<RecipientDashboard  />} />
      </Routes>
    </Router>
  );
}

export default App;