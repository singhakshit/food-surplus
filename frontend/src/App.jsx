import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home'; // Points directly to your new file

// Temporary placeholders for our next features
const DonorDashboard = () => <div className="p-10"><h2>Donor Portal</h2><p>Form coming soon...</p></div>;
const RecipientMap = () => <div className="p-10"><h2>Recipient Map View</h2><p>Map engine coming soon...</p></div>;

function App() {
  return (
    <Router>
      {/* Global Navigation Bar */}
      <nav className="flex justify-between items-center p-4 bg-white border-b border-gray-100 shadow-sm">
        <Link to="/" className="font-bold text-xl text-green-600 no-underline">
          🥗 SurplusShare
        </Link>
        <div className="flex gap-6">
          <Link to="/donor" className="text-gray-600 hover:text-green-600 no-underline font-medium">Donor Portal</Link>
          <Link to="/recipient" className="text-gray-600 hover:text-green-600 no-underline font-medium">Find Food</Link>
        </div>
      </nav>

      {/* URL Route Switcher */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/recipient" element={<RecipientMap />} />
      </Routes>
    </Router>
  );
}

export default App;