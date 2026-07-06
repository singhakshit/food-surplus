import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MapPin, Clock, ShieldAlert, Package, CheckCircle } from 'lucide-react';
import DashboardMap from '../components/DashboardMap'; // Import the new map UI hook

export default function RecipientDashboard() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [geoTrackingStatus, setGeoTrackingStatus] = useState('requesting');

  useEffect(() => {
    // 1. Core Browser Geolocation Engine Request API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          setGeoTrackingStatus('success');
          fetchNearbyDonations(coords.lat, coords.lng);
        },
        (error) => {
          console.error("Geolocation blocked/failed:", error);
          setTimeout(() => {
            setGeoTrackingStatus('blocked');
            fetchStandardDonations();
          }, 0);
        }
      );
    } else {
  // instant timeout to prevent blocking the UI thread if geolocation is unsupported
        setTimeout(() => {
          setGeoTrackingStatus('unsupported');
          fetchStandardDonations();
        }, 0);
      }

    // 2. Fetch using our optimized 5km RPC Math Function
    async function fetchNearbyDonations(lat, lng) {
      try {
        const { data, error } = await supabase
          .rpc('get_nearby_donations', {
            user_lat: lat,
            user_lng: lng,
            max_distance_km: 5.0
          });

        if (error) throw error;
        setDonations(data || []);
      } catch (error) {
        console.error('Error executing map proximity filter RPC:', error);
      } finally {
        setLoading(false);
      }
    }

    // Fallback traditional database query fetcher
    async function fetchStandardDonations() {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .eq('status', 'available')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDonations(data || []);
      } catch (error) {
        console.error('Error fetching global listings:', error);
      } finally {
        setLoading(false);
      }
    }

    // 3. Keep Realtime WebSockets open to synchronize deletions and claims
    const channel = supabase
      .channel('realtime-donations-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, (payload) => {
        // Real-time synchronization logic remains fully active
        if (payload.eventType === 'INSERT' && payload.new.status === 'available') {
          setDonations((prev) => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          if (payload.new.status !== 'available') {
            setDonations((prev) => prev.filter((item) => item.id !== payload.new.id));
          } else {
            setDonations((prev) => prev.map((item) => item.id === payload.new.id ? payload.new : item));
          }
        } else if (payload.eventType === 'DELETE') {
          setDonations((prev) => prev.filter((item) => item.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleClaimDonation = async (donationId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Secure Access: Please sign in or register an account to claim community food donations.");
        navigate("/login");
        return;
      }

      const { error } = await supabase
        .from('donations')
        .update({ 
          status: 'claimed',
          claimed_by: session.user.email
        })
        .eq('id', donationId);

      if (error) throw error;
      alert('Food item successfully claimed! Coordinate your collection logistics.');
    } catch (error) {
      console.error('Error claiming donation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-500 font-medium bg-slate-50 gap-2">
        <div className="animate-pulse">Pinpointing your physical proximity mapping canvas...</div>
        <div className="text-xs text-slate-400">Please click "Allow Location Access" if prompted.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-6 text-left flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Available Food Surplus</h1>
            <p className="text-slate-500 mt-1 text-base">
              Real-time listings inside your 5km local distribution circle.
            </p>
          </div>
          <div className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-white shadow-sm self-start sm:self-auto">
            {geoTrackingStatus === 'success' && <span className="text-green-700">🟢 Radius Locked (5km Radius Map Active)</span>}
            {geoTrackingStatus === 'blocked' && <span className="text-amber-600">🟡 Location Blocked (Showing Global Items)</span>}
          </div>
        </div>

        {/* 🗺️ INTERACTIVE VISUAL CANVAS POSITION */}
        <DashboardMap userLocation={userLocation} donations={donations} />

        {donations.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm max-w-2xl mx-auto mt-6">
            <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No surplus food inside this 5km zone</h3>
            <p className="text-slate-500 mt-1 text-sm">
              Try posting a mock placeholder item using another terminal browser tab to see markers paint live.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <div 
                key={donation.id} 
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between text-left hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="font-bold text-xl text-slate-900 line-clamp-2">{donation.food_type}</h3>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 font-medium text-xs whitespace-nowrap border border-green-100 shrink-0">
                      <Package className="w-3.5 h-3.5" />
                      {donation.quantity}
                    </div>
                  </div>

                  <div className="space-y-2.5 my-5 text-sm text-slate-600">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{donation.pickup_location}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Expires: {new Date(donation.expiration_time).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleClaimDonation(donation.id)}
                  className="w-full mt-4 py-2 px-4 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg text-sm text-center transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Claim Donation
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}