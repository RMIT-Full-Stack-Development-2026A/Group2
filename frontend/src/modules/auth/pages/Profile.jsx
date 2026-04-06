import React, { useEffect, useState } from 'react'
import { httpGet } from '../../../lib/httpClient';
import { Link } from 'react-router-dom';

const Profile = () => {
const [user, setUser] = useState(null);
useEffect(() => {
    // Fetch user profile data from backend
    const fetchProfile = async () => {
        try {
            const response = await httpGet("http://localhost:3000/api/auth/profile");
            const data = await response.json();
            setUser(data.user);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    fetchProfile();
}, []);

  return (
    <div>
      <h2>Profile</h2>
      {user ? (
        <div>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>Account Status: {user.accountStatus}</p>

          <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Profile