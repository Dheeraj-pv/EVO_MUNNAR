import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import './TaxiView.css';

const TaxiView = ({ taxiDetails = [] }) => {
  const [selectedTaxi, setSelectedTaxi] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [distance, setDistance] = useState(null);
  const [totalCost, setTotalCost] = useState(null);

  const taxis = taxiDetails
    .filter((taxi) => taxi.availability && taxi.availability.toLowerCase() === 'yes')
    .map((taxi, idx) => ({
      id: taxi.id || idx + 1,
      number: taxi.vh_number,
      type: taxi.model,
      status: 'Available',
      rate: taxi.rate,
      image: taxi.model?.toLowerCase().includes('suv') ? '🚐' : taxi.model?.toLowerCase().includes('sedan') ? '🚙' : '🚗'
    }));

  const handleBook = () => {
    if (selectedTaxi) setShowBookingForm(true);
  };

  const handleConfirm = () => {
    if (distance && totalCost) {
      window.location.href = `/bill?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}&rate=${selectedTaxi.rate}&distance=${distance}&total=${totalCost}`;
    } else {
      alert('Please calculate distance first');
    }
  };

  const handleCancel = () => {
    setShowBookingForm(false);
    setPickup('');
    setDropoff('');
    setDistance(null);
    setTotalCost(null);
  };

  const calculateDistance = async () => {
    if (!pickup || !dropoff) return;

    try {
      // Geocode pickup
      const pickupResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickup)}`);
      const pickupData = await pickupResponse.json();
      if (!pickupData.length) throw new Error('Pickup location not found');

      const pickupLat = pickupData[0].lat;
      const pickupLng = pickupData[0].lon;

      // Geocode dropoff
      const dropoffResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropoff)}`);
      const dropoffData = await dropoffResponse.json();
      if (!dropoffData.length) throw new Error('Drop-off location not found');

      const dropoffLat = dropoffData[0].lat;
      const dropoffLng = dropoffData[0].lon;

      // Get route from OSRM
      const routeResponse = await fetch(`https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}?overview=false`);
      const routeData = await routeResponse.json();
      if (!routeData.routes || !routeData.routes.length) throw new Error('Route not found');

      const distanceInMeters = routeData.routes[0].distance;
      const distanceInKm = (distanceInMeters / 1000).toFixed(2);
      setDistance(`${distanceInKm} km`);

      // Calculate total cost
      const cost = distanceInKm * selectedTaxi.rate;
      setTotalCost(cost.toFixed(2));
    } catch (error) {
      console.error('Distance calculation failed:', error);
      setDistance('Unable to calculate');
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="taxi-view booking-confirmation fade-in">
        <div className="confirmation-card">
          <div className="success-icon">✅</div>
          <h2>Booking Confirmed!</h2>
          <p>Taxi <strong>{selectedTaxi.number}</strong> ({selectedTaxi.type}) is booked.</p>
          <p>Pickup: {pickup}</p>
          <p>Drop-off: {dropoff}</p>
          {distance && <p>Distance: {distance}</p>}
          {totalCost && <p>Total Cost: ₹{totalCost}</p>}
          <Button variant="outline" onClick={() => { setBookingConfirmed(false); setSelectedTaxi(null); setPickup(''); setDropoff(''); setDistance(null); setTotalCost(null); }}>
            Book Another Ride
          </Button>
        </div>
      </div>
    );
  }

  if (showBookingForm) {
    return (
      <div className="taxi-view booking-form fade-in">
        <div className="form-card">
          <h2>Book Taxi {selectedTaxi.number} - ₹{selectedTaxi.rate}/km</h2>
          <form>
            <div className="form-group">
              <label htmlFor="pickup">Pickup Location</label>
              <input
                type="text"
                id="pickup"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dropoff">Drop-off Location</label>
              <input
                type="text"
                id="dropoff"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <Button type="button" variant="secondary" onClick={calculateDistance}>
                Calculate Distance
              </Button>
              {distance && <p>Estimated Distance: {distance}</p>}
              {totalCost && <p>Estimated Total Cost: ₹{totalCost}</p>}
            </div>
            <div className="form-actions">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="button" variant="primary" onClick={handleConfirm}>
                Confirm Booking
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="taxi-view fade-in">
      <div className="taxi-header">
        <h2>Available Taxis</h2>
        <p className="subtitle">Select a taxi from our currently available fleet.</p>
      </div>
      
      <div className="taxi-grid">
        {taxis.length > 0 ? (
          taxis.map((taxi) => (
            <Card 
              key={taxi.id}
              className={`taxi-fleet-card ${selectedTaxi?.id === taxi.id ? 'selected' : ''}`}
              onClick={() => setSelectedTaxi(taxi)}
            >
              <input type="hidden" value={taxi.id} />
              <div className="taxi-fleet-content">
                <div className="taxi-image-large">{taxi.image}</div>
                <div className="taxi-fleet-details">
                  <div className="taxi-number-plate">{taxi.number}</div>
                  <div className="taxi-type">{taxi.type}</div>
                </div>
                <div className="taxi-fleet-details">
                <div className="taxi-status">
                  <span className="status-dot"></span>
                  {taxi.status}
                </div>
                <div className="taxi-rate">
                  ₹{taxi.rate}/km
                </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="no-vehicles-message">No vehicles available</div>
        )}
      </div>

      <div className="booking-action-bar">
         <Button 
           variant="primary" 
           size="lg" 
           disabled={!selectedTaxi}
           onClick={handleBook}
         >
           {selectedTaxi ? `Book Taxi ${selectedTaxi.number}` : 'Select an available taxi'}
         </Button>
      </div>
    </div>
  );
};

export default TaxiView;
