import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Radio, Play, Pause, Volume2, Music } from 'lucide-react';
import { radioStations } from '../services/radioData';

export default function RadiosPage({ session, voiceSearch, onBack }) {
  const [selectedStation, setSelectedStation] = useState(radioStations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const audioRef = useRef(null);

  const categories = ['Todos', ...new Set(radioStations.map(r => r.category))];

  useEffect(() => {
    if (voiceSearch) {
      const query = voiceSearch.toLowerCase().replace(/[.,?!;:"]/g, '').trim();
      const match = radioStations.find(r => r.name.toLowerCase().includes(query) || r.category.toLowerCase().includes(query));
      if (match) {
        setSelectedStation(match);
        setIsPlaying(true);
      }
    }
  }, [voiceSearch]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.src = selectedStation.url;
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, selectedStation]);

  const playStation = (station) => {
    if (selectedStation?.id === station.id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedStation(station);
      setIsPlaying(true);
    }
  };

  const filtered = radioStations.filter(s => {
    const matchCat = selectedCategory === 'all' || selectedCategory === 'Todos' || s.category === selectedCategory;
    const matchSearch = !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page-transition" style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
      <audio ref={audioRef} style={{ display: 'none' }} />

      <div style={{ padding: '14px 30px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border)', background: 'rgba(7,11,20,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ padding: '8px 16px', gap: 6 }}><ArrowLeft size={16} /> Voltar</button>
        <Radio size={20} color="var(--accent-green)" />
        <span style={{ fontWeight: 800, fontSize: 18 }}>Rádios Ao Vivo</span>
        <div style={{ flex: 1 }} />
        <input className="input-field" style={{ width: 220 }} placeholder="Buscar rádio..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 30px', overflowX: 'auto', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat === 'Todos' ? 'all' : cat)} style={{ padding: '6px 16px', borderRadius: 20, border: 'none', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer', background: (selectedCategory === cat || (cat === 'Todos' && selectedCategory === 'all')) ? 'var(--accent-green)' : 'rgba(255,255,255,0.06)', color: 'white', transition: 'all 0.2s' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Radio Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {filtered.map(station => {
              const active = selectedStation?.id === station.id;
              const playing = active && isPlaying;
              return (
                <div key={station.id} onClick={() => playStation(station)} style={{
                  background: active ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                  border: active ? '2px solid var(--accent-green)' : '1px solid var(--border)',
                  borderRadius: 16, padding: '20px 16px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                  transition: 'all 0.2s', transform: active ? 'scale(1.02)' : 'scale(1)'
                }}>
                  <div style={{ fontSize: 36, lineHeight: 1 }}>{station.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 13, textAlign: 'center', color: active ? 'white' : 'var(--text-primary)' }}>{station.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>{station.freq}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: active ? 'var(--accent-green)' : 'var(--text-muted)', background: active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 12 }}>
                    {playing ? <Pause size={11} /> : <Play size={11} />}
                    {playing ? 'Tocando' : 'Ouvir'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Now Playing */}
        <div style={{ width: 300, borderLeft: '1px solid var(--border)', padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: isPlaying ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', border: `3px solid ${isPlaying ? 'var(--accent-green)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, fontSize: 48, transition: 'all 0.3s', animation: isPlaying ? 'spin 8s linear infinite' : 'none' }}>
            {selectedStation.icon}
          </div>
          <div style={{ fontWeight: 800, fontSize: 16, textAlign: 'center', marginBottom: 6 }}>{selectedStation.name}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 8 }}>{selectedStation.category}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginBottom: 28 }}>{selectedStation.freq}</div>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: 64, height: 64, borderRadius: '50%', background: isPlaying ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 24, transition: 'all 0.2s', boxShadow: isPlaying ? '0 0 30px rgba(16,185,129,0.4)' : 'none' }}>
            {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 3 }} />}
          </button>
          {isPlaying && (
            <div style={{ marginTop: 20, display: 'flex', gap: 4 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width: 4, background: 'var(--accent-green)', borderRadius: 2, animation: `equalizer-${i} ${0.5 + i * 0.1}s ease-in-out infinite alternate`, height: `${10 + Math.random() * 20}px` }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}