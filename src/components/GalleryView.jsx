import React, { useState, useEffect } from 'react';
import { getEntries, deleteEntry, updateEntry } from '../storage';
import { Trash2, Edit3 } from 'lucide-react';

const moods = [
  { id: 'delighted', label: 'Delighted', emoji: '😄' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'stressed', label: 'Stressed', emoji: '😫' },
  { id: 'depressed', label: 'Depressed', emoji: '😔' },
  { id: 'mad', label: 'Mad', emoji: '😡' },
];

const GalleryView = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [notes, setNotes] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, [user.uid]);

  const loadEntries = async () => {
    setLoading(true);
    const data = await getEntries(user.uid);
    setEntries(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mood entry?')) {
      await deleteEntry(id);
      loadEntries();
    }
  };

  const handleEditClick = (entry) => {
    setEditingEntry(entry);
    setNotes(entry.notes || '');
    const moodObj = moods.find(m => m.id === entry.mood) || moods[0];
    setSelectedMood(moodObj);
  };

  const handleSaveEdit = async () => {
    if (editingEntry) {
      await updateEntry(editingEntry.id, {
        mood: selectedMood.id,
        emoji: selectedMood.emoji,
        notes: notes
      });
      loadEntries();
      setEditingEntry(null);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

  return (
    <div className="gallery-view">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700 }}>Your Mood Gallery</h1>
        <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>
          Look back at how you've been feeling over time.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📓</div>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '10px' }}>No entries yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Go to the Home page to record your first mood!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {entries.map(entry => {
            const dateObj = new Date(entry.timestamp);
            const dateStr = dateObj.toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
            });

            return (
              <div key={entry.id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{
                  fontSize: '48px',
                  background: 'rgba(0,0,0,0.03)',
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '100px'
                }}>
                  {entry.emoji}
                </div>
                
                <div style={{ flex: 1, paddingTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, textTransform: 'capitalize' }}>{entry.mood}</h3>
                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{dateStr}</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => handleEditClick(entry)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '5px' }}
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(entry.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)', padding: '5px' }}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {entry.notes && (
                    <p style={{ marginTop: '15px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      "{entry.notes}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingEntry && (
        <div className="modal-overlay" onClick={() => setEditingEntry(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-emoji">{selectedMood?.emoji}</span>
              <h3 className="modal-title">Edit Entry</h3>
            </div>
            
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {moods.map(m => (
                    <button
                        key={m.id}
                        onClick={() => setSelectedMood(m)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '20px',
                            border: selectedMood?.id === m.id ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                            background: selectedMood?.id === m.id ? 'rgba(108, 92, 231, 0.1)' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <span>{m.emoji}</span>
                        <span style={{ fontSize: '14px' }}>{m.label}</span>
                    </button>
                ))}
            </div>

            <textarea
              className="textarea"
              placeholder="Share more thoughts about your mood..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setEditingEntry(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
