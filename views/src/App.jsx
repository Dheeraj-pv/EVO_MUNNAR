import React, { useState, useEffect } from 'react';
import './index.css';
import './App.css';
import Tabs from './components/Tabs';
import SearchWidget from './components/SearchWidget';
import TaxiView from './components/TaxiView';
import HotelView from './components/HotelView';

// Example icons
const TaxiIcon = () => <span>🚕</span>;
const HotelIcon = () => <span>🏨</span>;

function App() {
  const [activeTab, setActiveTab] = useState('hotel'); // Default to hotel to show new features immediately
  const [taxiDetails, setTaxiDetails] = useState([]);
  const [hotelDetails, setHotelDetails] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const mainTabs = [
    { id: 'taxi', label: 'Taxis & Rides', icon: <TaxiIcon /> },
    { id: 'hotel', label: 'Rooms & Stays', icon: <HotelIcon /> },
  ];

  const fetchTaxiDetails = async () => {
    try {
      const response = await fetch('/get_allTaxiDetails');
      const data = await response.json();
      // API returns { message, status, status_code, data: rows }
      setTaxiDetails(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Failed to load taxi details', error);
      setTaxiDetails([]);
    }
  };

  const fetchHotelDetails = async () => {
    try {
      const response = await fetch('/get_allHotelDetails');
      const data = await response.json();
      setHotelDetails(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Failed to load hotel details', error);
      setHotelDetails([]);
    }
  };

  useEffect(() => {
    if (activeTab === 'taxi') {
      fetchTaxiDetails();
    } else if (activeTab === 'hotel') {
      fetchHotelDetails();
    }
  }, [activeTab]);


  return (
    <div className="app-container">
      <header className="navbar">
        <div className="container">
          <div className="logo">Trips<span>Booking</span></div>
          <nav>
            <a href="#">Offers</a>
            <a href="#">Support</a>
            <a 
              href="#" 
              className="nav-login" 
              >
              Logout
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero fade-in">
          <div className="container">
            <h1 className="hero-title">Where to next?</h1>
            <p className="hero-subtitle">Book taxis and premium rooms seamlessly</p>
            
            <div className="hero-search-container">
              <Tabs 
                tabs={mainTabs} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
              <SearchWidget type={activeTab} />
            </div>
          </div>
        </section>

        {/* Content specific to active tab will go here */}
        <section className="dashboard container fade-in">
          {activeTab === 'taxi' ? (
            <TaxiView taxiDetails={taxiDetails} />
          ) : (
            <HotelView hotelDetails={hotelDetails} isAdmin={isAdmin} />
          )}
        </section>

      </main>
    </div>
  );
}

export default App;
