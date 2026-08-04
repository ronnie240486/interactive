import React from 'react';
import { X } from 'lucide-react';

export default function TrailerModal({ movie, onClose }) {
  if (!movie) return null;

  const title = movie.name || movie.title || 'Trailer';
  const cleanTitle = title.replace(/[.,?!;:"]/g, '').trim();
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanTitle + ' trailer oficial dublado')}`;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, width: '100%', maxWidth: 900, height: '80vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative'
      }}>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ color: 'white', fontSize: 20, fontWeight: 800 }}>Trailer: {title}</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <iframe 
            src={searchUrl} 
            title={title} 
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}