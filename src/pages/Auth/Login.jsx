import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import classes from './loginPage.module.css';

export default function Login({ setUser, setIsAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (username === "admin" && password === "123admin") {
      localStorage.setItem('user', 'admin');
      localStorage.setItem('isAdmin', 'true');
      setUser('admin');
      setIsAdmin(true);
      navigate('/admin-dashboard');
    } else {
      try {
        const { data } = await axios.post('https://vynceianoani.helioho.st/cedeno/login.php', { username, password });
  
        console.log('Setting token:', data.token);  // This is the user ID
        console.log('Setting user:', username);
        console.log('Setting isAdmin:', 'false');
  
        localStorage.setItem('token', data.token);  // Store the user ID as the token
        localStorage.setItem('user', username);
        localStorage.setItem('isAdmin', 'false');
        setUser(username);
        setIsAdmin(false);
  
        // Navigate to OrderStatus and send the username in the state
        navigate('/order', { state: { username } });
      } catch (error) {
        alert(`Login failed: ${error.response?.data || 'Invalid credentials'}`);
      }
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
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>
        <div className={classes.registerPrompt}>
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
