import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.module.css'; // Import the CSS file

export default function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Retrieve the stored username or token from localStorage
    const storedUsername = localStorage.getItem('user'); // Assuming 'username' is saved in localStorage

    if (storedUsername) {
      // Fetch user data based on the stored username
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get('https://vynceianoani.helioho.st/cedeno/getProfile.php', {
            params: { username: storedUsername },
          });

          if (response.data) {
            setName(response.data.name);
            setAddress(response.data.address);
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };

      fetchUserProfile();
    }
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user'); // Assuming username is stored in localStorage

    if (!username) {
        alert("Username not found in local storage.");
        return;
    }

    try {
        const response = await axios.put('https://vynceianoani.helioho.st/cedeno/updateProfile.php', {
            username,  // Send username in the request
            name,
            address,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        alert(response.data);
        setIsEditing(false); // Exit edit mode after successful update
    } catch (error) {
        console.error('Error updating profile:', error);
        alert(`Failed to update profile: ${error.response?.data || 'Unknown error occurred'}`);
    }
};


  return (
    <div className="profileContainer">
      <div className="profileCard">
        <h2>Profile</h2>
        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="profileForm">
            <div className="formField">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="profileInput"
                required
              />
            </div>
            <div className="formField">
              <label>Address:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="profileInput"
                required
              />
            </div>
            <button type="submit" className="submitButton">Update Profile</button>
          </form>
        ) : (
          <div className="profileDetails">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Address:</strong> {address}</p>
            <button onClick={() => setIsEditing(true)} className="editButton">Edit</button>
          </div>
        )}
      </div>
    </div>
  );
}
