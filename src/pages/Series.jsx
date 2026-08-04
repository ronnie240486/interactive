import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Play, Star } from 'lucide-react';
import { getSeriesCategories, getSeriesStreams } from '../services/xtreamApi';

export default function Series({ session, voiceSearch, onBack, onOpenSeries }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [seriesList, setSeriesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [hoveredSeries, setHoveredSeries] = useState(null);
  const [bgImage, setBgImage] = useState(null);

  useEffect(() => { return () => setSearchTerm(''); }, []);

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
        const cats = await getSeriesCategories(session.dns, session.user, session.pass);
        setCategories(cats || []);
        const s = await getSeriesStreams(session.dns, session.user, session.pass, selectedCategory === 'all' ? null : selectedCategory);
        setSeriesList(s || []);
        if (s && s[0]?.cover) setBgImage(s[0].cover);
      } catch (e) {}
      setLoading(false);
    }
    load();
  }, [session, selectedCategory]);

  const filtered = seriesList.filter(s => !searchTerm || (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="page-transition" style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', zIndex: 100, overflow: 'hidden' }}>
      {bgImage && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.06, zIndex: 0, pointerEvents: 'none' }} />}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '14px 30px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border)', background: 'rgba(7,11,20,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
          <button className="btn btn-ghost" onClick={onBack} style={{ padding: '8px 16px', gap: 6 }}><ArrowLeft size={16} /> Voltar</button>
          <span style={{ fontSize: 20 }}>🍿</span>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Séries</span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 14px', gap: 8, width: 260 }}>
            <Search size={15} color="var(--text-muted)" />
            <input className="input-field" style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 13, width: '100%' }} placeholder="Buscar série..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, padding: '12px 30px', overflowX: 'auto', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSelectedCategory('all')} style={{ padding: '6px 16px', borderRadius: 20, border: 'none', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer', background: selectedCategory === 'all' ? 'var(--accent-purple)' : 'rgba(255,255,255,0.06)', color: 'white', transition: 'all 0.2s' }}>Todos</button>
          {categories.map(cat => (
            <button key={cat.category_id} onClick={() => setSelectedCategory(cat.category_id)} style={{ padding: '6px 16px', borderRadius: 20, border: 'none', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer', background: selectedCategory === cat.category_id ? 'var(--accent-purple)' : 'rgba(255,255,255,0.06)', color: 'white', transition: 'all 0.2s' }}>
              {cat.category_name}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 30px' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}><div className="spinner" /></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {filtered.map(series => (
                <div key={series.series_id}
                  onMouseEnter={() => { setHoveredSeries(series); if (series.cover) setBgImage(series.cover); }}
                  onMouseLeave={() => setHoveredSeries(null)}
                  onClick={() => onOpenSeries && onOpenSeries(series)}
                  style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: hoveredSeries?.series_id === series.series_id ? '2px solid var(--accent-purple)' : '2px solid transparent', transition: 'all 0.2s', transform: hoveredSeries?.series_id === series.series_id ? 'scale(1.03)' : 'scale(1)' }}>
                  <div style={{ position: 'relative', paddingBottom: '150%', overflow: 'hidden' }}>
                    <img src={series.cover || '/favicon.ico'} alt={series.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = '/favicon.ico'; }} />
                    {hoveredSeries?.series_id === series.series_id && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={36} color="white" />
                      </div>
                    )}
                    {series.rating && (
                      <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '2px 6px', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Star size={10} color="#FBBF24" fill="#FBBF24" />
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#FBBF24' }}>{parseFloat(series.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{series.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 80 }}>
              <span style={{ fontSize: 64 }}>🍿</span>
              <p style={{ fontSize: 16, marginTop: 16 }}>Nenhuma série encontrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}