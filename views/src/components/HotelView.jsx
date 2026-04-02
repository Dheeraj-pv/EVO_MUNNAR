import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import './HotelView.css';

const initialRooms = [
  { 
    id: 1, 
    name: 'Oceanview King Suite', 
    type: 'Suite', 
    capacity: '2 Adults', 
    price: '₹ 15,000', 
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800',
    amenities: ['King Bed', 'Ocean View', 'Balcony', 'Free WiFi', 'Mini Bar'],
    description: 'Experience unparalleled luxury in our Oceanview King Suite, featuring panoramic sea vistas, a private balcony, and exquisite modern furnishings.'
  },
  { 
    id: 2, 
    name: 'Premium City Double', 
    type: 'Double', 
    capacity: '2 Adults, 2 Children', 
    price: '₹ 9,500', 
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    amenities: ['Two Double Beds', 'City View', 'Free WiFi', 'Work Desk'],
    description: 'Perfect for families or friends, offering spacious comfort with stunning city skyline views and elegant decor.'
  },
  { 
    id: 3, 
    name: 'Deluxe Studio', 
    type: 'Studio', 
    capacity: '2 Adults', 
    price: '₹ 7,200', 
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
    amenities: ['Queen Bed', 'Kitchenette', 'Smart TV', 'Free WiFi'],
    description: 'A cozy, modern studio equipped with a convenient kitchenette, ideal for extended stays or business travelers.'
  },
];

const HotelView = ({ isAdmin, hotelDetails = [] }) => {
  const [rooms, setRooms] = useState(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Room State
  const [newRoom, setNewRoom] = useState({
    name: '', type: 'Standard', capacity: '', price: '', image: '', description: '', amenities: ''
  });

  useEffect(() => {
    if (hotelDetails && hotelDetails.length > 0) {
      const mappedRooms = hotelDetails.map((room) => {
        let amenities = [];
        if (Array.isArray(room.amenities)) {
          amenities = room.amenities;
        } else if (room.amenities) {
          try {
            amenities = JSON.parse(room.amenities);
            if (!Array.isArray(amenities)) {
              amenities = [];
            }
          } catch (e) {
            amenities = String(room.amenities).split(',').map((item) => item.trim()).filter(Boolean);
          }
        }

        return {
          id: room.id,
          name: room.name,
          type: room.type,
          capacity: `${room.capacity_adults || 0} Adults${room.capacity_children ? `, ${room.capacity_children} Children` : ''}`,
          price: `₹ ${Number(room.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          image: room.image || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
          amenities,
          description: room.description || 'No description available.',
        };
      });
      setRooms(mappedRooms);
    } else {
      setRooms(initialRooms);
    }
  }, [hotelDetails]);

  const handleAddRoom = (e) => {
    e.preventDefault();
    const roomToAdd = {
      ...newRoom,
      id: Date.now(),
      amenities: newRoom.amenities.split(',').map(a => a.trim()),
      // Fallback image if empty
      image: newRoom.image || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'
    };
    setRooms([roomToAdd, ...rooms]);
    setShowAddForm(false);
    setNewRoom({ name: '', type: 'Standard', capacity: '', price: '', image: '', description: '', amenities: '' });
  };

  return (
    <div className="hotel-view fade-in">
      <div className="room-header-flex">
        <div>
          <h2 className="gradient-text">Available Luxury Rooms</h2>
          <p className="subtitle">Discover our exclusive selection of premium accommodations.</p>
        </div>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowAddForm(true)}>+ Add New Room</Button>
        )}
      </div>

      <div className="room-grid">
        {rooms.map((room) => (
          <Card key={room.id} className="room-card" onClick={() => setSelectedRoom(room)}>
            <div className="room-image" style={{ backgroundImage: `url(${room.image})` }}>
              <div className="room-type-badge">{room.type}</div>
            </div>
            <div className="room-info">
              <h3>{room.name}</h3>
              <p className="capacity">👥 {room.capacity}</p>
              
              <div className="room-amenities">
                {room.amenities.slice(0, 3).map((amenity, i) => (
                  <span key={i} className="amenity-pill">{amenity}</span>
                ))}
                {room.amenities.length > 3 && <span className="amenity-pill">+{room.amenities.length - 3}</span>}
              </div>

              <div className="room-bottom-row">
                <div className="room-price">
                  <strong>{room.price}</strong> <span className="per-night">/ night</span>
                </div>
                <Button variant="secondary" size="sm">View Details</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Room Detail Modal */}
      {selectedRoom && (
        <div className="modal-overlay fade-in" onClick={() => setSelectedRoom(null)}>
          <div className="modal-content room-detail-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedRoom(null)}>×</button>
            <div className="modal-image" style={{ backgroundImage: `url(${selectedRoom.image})` }}></div>
            <div className="modal-body">
              <span className="room-type-badge mb">{selectedRoom.type}</span>
              <h2>{selectedRoom.name}</h2>
              <p className="modal-price"><strong>{selectedRoom.price}</strong> / night</p>
              <p className="capacity">👥 {selectedRoom.capacity}</p>
              
              <div className="divider"></div>
              
              <p className="description">{selectedRoom.description}</p>
              
              <div className="divider"></div>
              
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {selectedRoom.amenities.map((amenity, i) => (
                  <span key={i} className="amenity-item">✓ {amenity}</span>
                ))}
              </div>

              <div className="modal-footer">
                <Button variant="primary" size="lg" className="full-width" onClick={() => {
                  alert('Booking logic would execute here!');
                  setSelectedRoom(null);
                }}>
                  Reserve this Room
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Room Admin Modal */}
      {showAddForm && isAdmin && (
        <div className="modal-overlay fade-in" onClick={() => setShowAddForm(false)}>
          <div className="modal-content admin-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowAddForm(false)}>×</button>
            <h2>Add New Room</h2>
            <form onSubmit={handleAddRoom} className="admin-form">
              <div className="form-group">
                <label>Room Name</label>
                <input required value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} placeholder="e.g. Royal Suite" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <input required value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value})} placeholder="e.g. Suite" />
                </div>
                <div className="form-group">
                  <label>Price / Night</label>
                  <input required value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} placeholder="e.g. ₹ 10,000" />
                </div>
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input required value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: e.target.value})} placeholder="e.g. 2 Adults" />
              </div>
              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input value={newRoom.image} onChange={e => setNewRoom({...newRoom, image: e.target.value})} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Amenities (comma separated)</label>
                <input required value={newRoom.amenities} onChange={e => setNewRoom({...newRoom, amenities: e.target.value})} placeholder="WiFi, TV, Pool" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea required rows="3" value={newRoom.description} onChange={e => setNewRoom({...newRoom, description: e.target.value})} placeholder="Describe the room..."></textarea>
              </div>
              <Button type="submit" variant="primary" className="full-width">Save Room</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelView;
