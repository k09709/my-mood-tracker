import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

const Login = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error logging in with Google", error);
      alert("Failed to log in. Please try again.");
    }
  };

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', width: '100vw' }}>
      <div className="card" style={{ maxWidth: '400px', textAlign: 'center', padding: '50px 30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '15px' }}>Mood Tracker</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
          Log in to track your daily moods and see your history across all your devices.
        </p>
        <button className="btn btn-primary" onClick={handleLogin} style={{ width: '100%', padding: '15px', fontSize: '16px' }}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
