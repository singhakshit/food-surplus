"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MapPin, Clock, ShieldAlert, Package, CheckCircle } from 'lucide-react';

export default function RecipientDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Data Fetch (Only get available items)
    async function fetchInitialDonations() {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .eq('status', 'available')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDonations(data || []);
      } catch (error) {
        console.error('Error loading donations:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialDonations();

    // 2. Realtime WebSocket Listener Setup
    const channel = supabase
      .channel('realtime-donations-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donations' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // A new donation was added! Inject it into the UI array if it's available
            if (payload.new.status === 'available') {
              setDonations((prev) => [payload.new, ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            // An item was claimed or updated!
            if (payload.new.status !== 'available') {
              // If it's no longer available, remove it from the screen
              setDonations((prev) => prev.filter((item) => item.id !== payload.new.id));
            } else {
              // Otherwise, update its data text in place
              setDonations((prev) =>
                prev.map((item) => (item.id === payload.new.id ? payload.new : item))
              );
            }
          } else if (payload.eventType === 'DELETE') {
            // An item was completely dropped from the table row
            setDonations((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // 3. Clean up the WebSockets radio listener channel when user navigates away
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 4. Handle Claim Action Mutation
  const handleClaimDonation = async (donationId) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({ status: 'claimed' })
        .eq('id', donationId);

      if (error) throw error;

      alert(' Food item successfully claimed! Coordinate your collection logistics.');
    } catch (error) {
      console.error('Error claiming donation:', error);
      alert('Could not claim item: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500 font-medium bg-slate-50">
        Loading available surplus...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Available Food Surplus</h1>
          <p className="text-slate-500 mt-1 text-base">
            Real-time listings of quality surplus food available for local distribution.
          </p>
        </div>

        {donations.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm max-w-2xl mx-auto mt-10">
            <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No active donations right now</h3>
            <p className="text-slate-500 mt-1 text-sm">
              Check back shortly or refresh the feed to view new community drop-offs.
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
                    <h3 className="font-bold text-xl text-slate-900 line-clamp-2">
                      {donation.food_type}
                    </h3>
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