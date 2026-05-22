import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Home, Image as ImageIcon, LogOut } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import HomeView from './components/HomeView';
import GalleryView from './components/GalleryView';
import Login from './components/Login';

const Sidebar = ({ user }) => {
  const handleLogout = () => signOut(auth);

  return (
    <div className="sidebar">
      <h1>MoodTracker</h1>
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={user.photoURL || 'https://via.placeholder.com/40'} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.displayName}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Logged in</div>
        </div>
      </div>
      <nav style={{ flex: 1 }}>
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Home size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/gallery" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <ImageIcon size={20} />
          <span>Gallery</span>
        </NavLink>
      </nav>
      <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar user={user} />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<HomeView user={user} />} />
            <Route path="/gallery" element={<GalleryView user={user} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
