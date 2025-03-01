// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../services/user.service';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // This would call your Event Service through the User Service proxy
        const response = await UserService.getAllEvents();
        setEvents(response.data);
      } catch (err) {
        setError('Failed to load events');
        console.error(err);
        // Use sample data if API call fails
        setEvents([
          { id: 1, title: 'Music Concert', date: '2024-03-15', location: 'City Hall', available_seats: 120 },
          { id: 2, title: 'Tech Conference', date: '2024-03-22', location: 'Convention Center', available_seats: 250 },
          { id: 3, title: 'Art Exhibition', date: '2024-04-05', location: 'Modern Art Museum', available_seats: 80 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading events...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h1>
      
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {error} - Showing sample data instead
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 h-48 flex items-center justify-center">
              <span className="text-gray-500 text-xl">Event Image</span>
            </div>
            
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              
              <div className="mb-4">
                <p className="text-gray-600"><span className="font-medium">Date:</span> {event.date}</p>
                <p className="text-gray-600"><span className="font-medium">Location:</span> {event.location}</p>
                <p className="text-gray-600"><span className="font-medium">Available Seats:</span> {event.available_seats}</p>
              </div>
              
              {isAuthenticated() ? (
                <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Book Tickets
                </button>
              ) : (
                <Link to="/login" className="block text-center w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Login to Book
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;