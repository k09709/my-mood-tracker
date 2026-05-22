import React, { useState, useEffect } from 'react';
import { getTodayEntry, addEntry, updateEntry } from '../storage';

const moods = [
  { id: 'delighted', label: 'Delighted', emoji: '😄', color: '#ff9ff3' },
  { id: 'calm', label: 'Calm', emoji: '😌', color: '#00d2d3' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: '#54a0ff' },
  { id: 'stressed', label: 'Stressed', emoji: '😫', color: '#feca57' },
  { id: 'depressed', label: 'Depressed', emoji: '😔', color: '#576574' },
  { id: 'mad', label: 'Mad', emoji: '😡', color: '#ff6b6b' },
];

const HomeView = ({ user }) => {
  const [todayEntry, setTodayEntry] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToday = async () => {
      const entry = await getTodayEntry(user.uid);
      setTodayEntry(entry);
      setLoading(false);
    };
    fetchToday();
  }, [user.uid]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    if (todayEntry && todayEntry.mood === mood.id) {
        setNotes(todayEntry.notes || '');
    } else {
        setNotes('');
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (todayEntry) {
      await updateEntry(todayEntry.id, {
        mood: selectedMood.id,
        emoji: selectedMood.emoji,
        notes: notes,
        timestamp: Date.now()
      });
    } else {
      await addEntry(user.uid, {
        date: new Date().toISOString(),
        mood: selectedMood.id,
        emoji: selectedMood.emoji,
        notes: notes
      });
    }
    const updated = await getTodayEntry(user.uid);
    setTodayEntry(updated);
    setShowModal(false);
    
    // Show toast
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

  return (
    <div className="home-view">
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', color: 'var(--text-secondary)', fontWeight: 500 }}>Today is</h2>
        <h1 style={{ fontSize: '36px', fontWeight: 700, marginTop: '5px' }}>{todayStr}</h1>
        {todayEntry && (
          <p style={{ marginTop: '10px', color: 'var(--primary)', fontWeight: 500 }}>
            You've already recorded your mood today. Select a mood to update it!
          </p>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '25px'
      }}>
        {moods.map((mood) => {
          const isSelected = todayEntry?.mood === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood)}
              className="card"
              style={{
                border: isSelected ? `2px solid ${mood.color}` : '2px solid transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '40px 20px',
                gap: '15px',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseOver={(e) => {
                 if (!isSelected) e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseOut={(e) => {
                 if (!isSelected) e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '56px' }}>{mood.emoji}</span>
              <span style={{ fontWeight: 600, fontSize: '18px', color: 'var(--text-primary)' }}>{mood.label}</span>
            </button>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-emoji">{selectedMood.emoji}</span>
              <h3 className="modal-title">Why are you feeling {selectedMood.label.toLowerCase()}?</h3>
            </div>
            <textarea
              className="textarea"
              placeholder="Share more thoughts about your mood..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Done</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <span>✅ Response recorded</span>
        </div>
      )}
    </div>
  );
};

export default HomeView;
