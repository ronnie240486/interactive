import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Play, Film, Star, Info } from 'lucide-react';
import { getVodCategories, getVodStreams } from '../services/xtreamApi';

export default function Movies({ session, voiceSearch, onBack, onPlay }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [bgImage, setBgImage] = useState(null);

  useEffect(() => {
    return () => setSearchTerm('');
  }, []);

  useEffect(() => {
    if (voiceSearch) {
      setSelectedCategory('all');
      setSearchTerm(voiceSearch.replace(/[.,?!;:"]/g, '').trim());
    }
  }, [voiceSearch]);

  useEffect(() => {
    async function load() {
      if (!session) return;
      setLoading(true);
      try {
        const cats = await getVodCategories(session.dns, session.user, session.pass);
        setCategories(cats || []);
        const vods = await getVodStreams(session.dns, session.user, session.pass, selectedCategory === 'all' ? null : selectedCategory);
        setMovies(vods || []);
        if (vods && vods[0]?.stream_icon) setBgImage(vods[0].stream_icon);
      } catch (e) {}
      setLoading(false);
    }
    load();
  }, [session, selectedCategory]);

  const filtered = movies.filter(m => !searchTerm || (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="page-transition" style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', zIndex: 100, overflow: 'hidden' }}>
      {bgImage && (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06, zIndex: 0, pointerEvents: 'none', transition: 'background-image 0.5s ease' }} />
      )}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={{ padding: '14px 30px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border)', background: 'rgba(7,11,20,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <button className="btn btn-ghost" onClick={onBack} style={{ padding: '8px 16px', gap: 6 }}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <Film size={20} color="#E11D48" />
          <span style={{ fontWeight: 800, fontSize: 18 }}>Filmes</span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 14px', gap: 8, width: 260 }}>
            <Search size={15} color="var(--text-muted)" />
            <input className="input-field" style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 13, width: '100%' }} placeholder="Buscar filme..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Category Bar */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 30px', overflowX: 'auto', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSelectedCategory('all')} style={{ padding: '6px 16px', borderRadius: 20, border: 'none', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer', background: selectedCategory === 'all' ? 'var(--accent-red)' : 'rgba(255,255,255,0.06)', color: 'white', transition: 'all 0.2s ease' }}>
            Todos
          </button>
          {categories.map(cat => (
            <button key={cat.category_id} onClick={() => setSelectedCategory(cat.category_id)} style={{ padding: '6px 16px', borderRadius: 20, border: 'none', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer', background: selectedCategory === cat.category_id ? 'var(--accent-red)' : 'rgba(255,255,255,0.06)', color: 'white', transition: 'all 0.2s ease' }}>
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* Movies Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 30px' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
              <div className="spinner" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {filtered.map(movie => (
                <div key={movie.stream_id}
                  onMouseEnter={() => { setHoveredMovie(movie); if (movie.stream_icon) setBgImage(movie.stream_icon); }}
                  onMouseLeave={() => setHoveredMovie(null)}
                  onClick={() => onPlay && onPlay(movie)}
                  style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative', border: hoveredMovie?.stream_id === movie.stream_id ? '2px solid var(--accent-red)' : '2px solid transparent', transition: 'all 0.2s ease', transform: hoveredMovie?.stream_id === movie.stream_id ? 'scale(1.03)' : 'scale(1)' }}>
                  <div style={{ position: 'relative', paddingBottom: '150%', overflow: 'hidden' }}>
                    <img src={movie.stream_icon || '/favicon.ico'} alt={movie.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = '/favicon.ico'; }} />
                    {hoveredMovie?.stream_id === movie.stream_id && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={36} color="white" />
                      </div>
                    )}
                    {movie.rating && (
                      <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '2px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Star size={10} color="#FBBF24" fill="#FBBF24" />
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#FBBF24' }}>{parseFloat(movie.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.3' }}>{movie.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 80 }}>
              <Film size={64} color="rgba(255,255,255,0.08)" style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 16 }}>Nenhum filme encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}