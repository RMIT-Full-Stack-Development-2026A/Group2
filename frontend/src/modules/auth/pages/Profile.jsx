import React, { useEffect, useState } from 'react'
import { API_ENDPOINTS, apiRequest } from '../../../config/api.config';
import { Link } from 'react-router-dom';

const Profile = () => {
const [user, setUser] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState("");
useEffect(() => {
    // Fetch user profile data from backend
    const fetchProfile = async () => {
        try {
    setError("");
      const data = await apiRequest(API_ENDPOINTS.auth.profile, {
        method: "GET",
      });
            setUser(data.user);
        } catch (error) {
            console.error("Error fetching profile:", error);
      setError(error?.message || "Failed to load profile.");
    } finally {
      setIsLoading(false);
        }
    };

    fetchProfile();
}, []);

  return (
    <div>
      <h2>Profile</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : user ? (
        <div>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>Account Status: {user.accountStatus}</p>

          <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      ) : (
        <p>Profile not found.</p>
      )}
    </div>
  )
}

export default Profile