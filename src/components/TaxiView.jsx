import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import './TaxiView.css';

const taxiData = [
  { id: 1, number: 'MH 01 AB 1234', type: 'Mini', status: 'Available', image: '🚗' },
  { id: 2, number: 'MH 02 CD 5678', type: 'Sedan', status: 'Available', image: '🚙' },
  { id: 3, number: 'MH 03 EF 9012', type: 'SUV', status: 'Available', image: '🚐' },
  { id: 4, number: 'MH 04 GH 3456', type: 'Sedan', status: 'Available', image: '🚙' },
  { id: 5, number: 'MH 05 IJ 7890', type: 'Mini', status: 'Available', image: '🚗' },
  { id: 6, number: 'MH 06 KL 1234', type: 'SUV', status: 'Available', image: '🚐' },
];

const TaxiView = () => {
  const [selectedTaxi, setSelectedTaxi] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleBook = () => {
    if (selectedTaxi) setBookingConfirmed(true);
  };

  if (bookingConfirmed) {
    return (
      <div className="taxi-view booking-confirmation fade-in">
        <div className="confirmation-card">
          <div className="success-icon">✅</div>
          <h2>Booking Confirmed!</h2>
          <p>Taxi <strong>{selectedTaxi.number}</strong> ({selectedTaxi.type}) is booked.</p>
          <Button variant="outline" onClick={() => { setBookingConfirmed(false); setSelectedTaxi(null); }}>
            Book Another Ride
          </Button>
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
        {taxiData.map((taxi) => (
          <Card 
            key={taxi.id} 
            className={`taxi-fleet-card ${selectedTaxi?.id === taxi.id ? 'selected' : ''}`}
            onClick={() => setSelectedTaxi(taxi)}
          >
            <div className="taxi-fleet-content">
              <div className="taxi-image-large">{taxi.image}</div>
              <div className="taxi-fleet-details">
                <div className="taxi-number-plate">{taxi.number}</div>
                <div className="taxi-type">{taxi.type}</div>
              </div>
              <div className="taxi-status">
                <span className="status-dot"></span>
                {taxi.status}
              </div>
            </div>
          </Card>
        ))}
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
