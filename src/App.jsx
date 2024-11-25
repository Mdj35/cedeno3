// App.js
import React, { useState } from 'react';
import Header from './components/Header/Header';
import AppRoutes from './AppRoutes';

function App() {
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  return (
    <div>
      <Header user={user} setUser={setUser} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <AppRoutes setUser={setUser} setIsAdmin={setIsAdmin} />
    </div>
  );
}

export default App;
