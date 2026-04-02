import React from 'react';
import Button from './Button';
import './SearchWidget.css';

const SearchWidget = ({ type }) => {
  return (
    <div className="search-widget">
      {type === 'taxi' ? (
        <div className="search-row">
          <div className="input-group">
            <label>Pickup Location</label>
            <input type="text" placeholder="Enter pickup location" />
          </div>
          <div className="input-divider"></div>
          <div className="input-group">
            <label>Drop Location</label>
            <input type="text" placeholder="Enter drop location" />
          </div>
          <div className="input-divider"></div>
          <div className="input-group">
            <label>Date & Time</label>
            <input type="datetime-local" />
          </div>
          <Button variant="primary" size="lg" className="search-btn">Search Cabs</Button>
        </div>
      ) : (
        <div className="search-row">
          <div className="input-group">
            <label>City, Property Name or Location</label>
            <input type="text" placeholder="E.g. Goa, Mumbai" />
          </div>
          <div className="input-divider"></div>
          <div className="input-group">
            <label>Check-in</label>
            <input type="date" />
          </div>
          <div className="input-divider"></div>
          <div className="input-group">
            <label>Check-out</label>
            <input type="date" />
          </div>
          <div className="input-divider"></div>
          <div className="input-group">
            <label>Guests & Rooms</label>
            <input type="text" placeholder="2 Adults, 1 Room" readOnly />
          </div>
          <Button variant="primary" size="lg" className="search-btn">Search Hotels</Button>
        </div>
      )}
    </div>
  );
};

export default SearchWidget;
