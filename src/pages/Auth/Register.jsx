import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import classes from './registerPage.module.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.post('https://vynceianoani.helioho.st/cedeno/register.php', { 
        username, 
        password, 
        name,
        address
      });
      alert('Registration successful');
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.leftPanel}>
        <h1 className={classes.title}>PZAM Cups</h1>
        <p className={classes.description}>
          Discover the finest collection of cups to elevate your daily beverage experience. 
          From stylish designs to durable materials, find the perfect cup for every occasion.
        </p>
      </div>
      <div className={classes.details}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <div className={classes.loginPrompt}>
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>

      {/* About Us Section */}
      <div className={classes.aboutUs}>
        <h2>About Us</h2>
        <p>
          At PZAM Cups, we are passionate about bringing you the best in drinkware. 
          Whether you're sipping your morning coffee or enjoying an evening tea, we believe 
          that the right cup can enhance every experience. Our curated collection is designed 
          with quality, aesthetics, and functionality in mind, ensuring that each cup serves 
          not just as a vessel, but as a part of your lifestyle. 
        </p>
        <p>
          We prioritize customer satisfaction, striving to provide products that offer both style 
          and durability. Join us as we elevate your beverage experience, one cup at a time.
        </p>
      </div>
    </div>
  );
}
