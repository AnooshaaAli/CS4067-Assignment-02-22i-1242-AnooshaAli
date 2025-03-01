// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import UserService from '../services/user.service';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await UserService.getCurrentUserProfile();
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Email</h3>
        <p className="text-gray-700">{profile?.email || currentUser?.email}</p>
      </div>
      
      {/* Add more profile information as needed */}
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Actions</h3>
        <div className="flex flex-col space-y-2">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View My Bookings
          </button>
          
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;