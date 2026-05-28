import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Temporary placeholder components for layout visualization
const Home = () => <div style={{ padding: '20px' }}><h2>Welcome to Food Surplus App</h2><p>Select your role to log in.</p></div>;
const DonorDashboard = () => <div style={{ padding: '20px' }}><h2>Donor Dashboard</h2><p>Post food surplus here.</p></div>;
const RecipientMap = () => <div style={{ padding: '20px' }}><h2>Recipient Map View</h2><p>Nearby food listings will appear here.</p></div>;

function App() {
  return (
    <Router>
      <nav style={{ padding: '15px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', gap: '15px' }}>
        <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#2b8a3e' }}>🥗 SurplusShare</Link>
        <Link to="/donor">Donor Portal</Link>
        <Link to="/recipient">Recipient Map</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/recipient" element={<RecipientMap />} />
      </Routes>
    </Router>
  );
}

export default App;