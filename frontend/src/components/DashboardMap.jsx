import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

export default function DashboardMap({ userLocation, donations }) {
  
  const defaultCenter = [20.5937, 78.9629]; 
  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0 mb-8">
      <MapContainer 
        center={mapCenter} 
        zoom={userLocation ? 13 : 5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterMap center={mapCenter} />

        {userLocation && (
          <>
            
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>📍 You are here</Popup>
            </Marker>

            
            <Circle 
              center={[userLocation.lat, userLocation.lng]}
              radius={5000} 
              pathOptions={{ 
                color: '#15803d', 
                fillColor: '#22c55e', 
                fillOpacity: 0.1 
              }}
            />
          </>
        )}

        {donations.map((donation) => (
          donation.lat && donation.lng && (
            <Marker key={donation.id} position={[donation.lat, donation.lng]}>
              <Popup>
                <div className="text-left font-sans">
                  <h4 className="font-bold text-slate-900 m-0 text-sm">{donation.food_type}</h4>
                  <p className="text-xs text-slate-600 my-1">Quantity: {donation.quantity}</p>
                  <p className="text-xs text-slate-500 m-0 line-clamp-1">{donation.pickup_location}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}