import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Play, Pause, Volume2, VolumeX, Maximize, Settings, Tv, SkipForward } from 'lucide-react';
import { getLiveCategories, getLiveStreams, buildStreamUrl } from '../services/xtreamApi';

export default function LiveTV({ session, voiceSearch, forcedChannel, onBack }) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    async function loadCategories() {
      if (!session) return;
      setLoading(true);
      try {
        const cats = await getLiveCategories(session.dns, session.user, session.pass);
        setCategories(cats || []);
        if (cats && cats.length > 0) setActiveCategory(cats[0].category_id);
      } catch (e) {}
      setLoading(false);
    }
    loadCategories();
  }, [session]);

  useEffect(() => {
    async function loadChannels() {
      if (!session) return;
      try {
        const categoryToFetch = voiceSearch ? null : activeCategory;
        const streams = await getLiveStreams(session.dns, session.user, session.pass, categoryToFetch);
        setChannels(streams || []);
        setFilteredChannels(streams || []);

        if (voiceSearch && streams && streams.length > 0) {
          const query = voiceSearch.replace(/^canal\s+/i, '').trim().toLowerCase();
          const match = streams.find(ch => (ch.name || '').toLowerCase().includes(query));
          if (match) {
            setCurrentChannel(match);
            setIsPlaying(true);
          }
        } else if (streams && streams.length > 0 && !currentChannel) {
          setCurrentChannel(streams[0]);
        }
      } catch (e) {}
    }
    if (activeCategory || voiceSearch) loadChannels();
  }, [session, activeCategory, voiceSearch]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredChannels(channels);
    } else {
      const q = searchTerm.toLowerCase();
      setFilteredChannels(channels.filter(ch => (ch.name || '').toLowerCase().includes(q)));
    }
  }, [searchTerm, channels]);

  const playChannel = (channel) => {
    setCurrentChannel(channel);
    setIsPlaying(true);
  };

  const streamUrl = currentChannel && session
    ? buildStreamUrl(session.dns, session.user, session.pass, currentChannel.stream_id)
    : null;

  return (
    <div className="page-transition" style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
      {/* Top Bar */}
      <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border)', background: 'rgba(7,11,20,0.95)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ padding: '8px 16px', gap: 6 }}>
          <ArrowLeft size={16} /> Voltar
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tv size={20} color="var(--accent-blue)" />
          <span style={{ fontWeight: 800, fontSize: 18 }}>TV Ao Vivo</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 14px', gap: 8, width: 240 }}>
          <Search size={15} color="var(--text-muted)" />
          <input className="input-field" style={{ background: 'transparent', border: 'none', padding: 0, fontSize: 13, width: '100%' }} placeholder="Buscar canal..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Category Sidebar */}
        <div style={{ width: 220, background: 'rgba(0,0,0,0.3)', borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0, padding: '12px 8px' }}>
          {categories.map(cat => (
            <button key={cat.category_id} onClick={() => setActiveCategory(cat.category_id)} style={{
              width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 8, marginBottom: 3,
              border: 'none', background: activeCategory === cat.category_id ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: activeCategory === cat.category_id ? '#93C5FD' : 'var(--text-secondary)',
              fontWeight: activeCategory === cat.category_id ? 700 : 500, fontSize: 13, cursor: 'pointer',
              borderLeft: activeCategory === cat.category_id ? '3px solid var(--accent-blue)' : '3px solid transparent'
            }}>
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* Channel List */}
        <div style={{ width: 280, borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0 }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
              <div className="spinner" />
            </div>
          ) : filteredChannels.map(ch => (
            <div key={ch.stream_id} onClick={() => playChannel(ch)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: 'pointer',
              background: currentChannel?.stream_id === ch.stream_id ? 'rgba(59,130,246,0.15)' : 'transparent',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              borderLeft: currentChannel?.stream_id === ch.stream_id ? '3px solid var(--accent-blue)' : '3px solid transparent',
              transition: 'all 0.15s ease'
            }}>
              <img src={ch.stream_icon || '/favicon.ico'} alt="" style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'contain', background: 'rgba(255,255,255,0.05)' }} onError={e => { e.target.style.display = 'none'; }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.name}</div>
              </div>
              {currentChannel?.stream_id === ch.stream_id && <Play size={14} color="var(--accent-blue)" />}
            </div>
          ))}
        </div>

        {/* Video Player */}
        <div style={{ flex: 1, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexDirection: 'column' }}>
          {currentChannel ? (
            <>
              {/* Channel Info Overlay */}
              <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.7)', borderRadius: 12, padding: '10px 16px', backdropFilter: 'blur(10px)' }}>
                <img src={currentChannel.stream_icon} alt="" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6 }} onError={e => { e.target.style.display = 'none'; }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{currentChannel.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>TV Ao Vivo</div>
                </div>
                <span className="tag tag-live live-badge">● AO VIVO</span>
              </div>

              {/* Player placeholder / embed area */}
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Tv size={80} color="rgba(59,130,246,0.4)" style={{ marginBottom: 20 }} />
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 8 }}>{currentChannel.name}</h2>
                <p style={{ fontSize: 14, marginBottom: 20 }}>Canal sintonizado — para assistir, use um player externo</p>
                {streamUrl && (
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '12px 20px', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace', maxWidth: 500, wordBreak: 'break-all' }}>
                    {streamUrl}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <Tv size={64} color="rgba(255,255,255,0.1)" style={{ marginBottom: 16 }} />
              <p>Selecione um canal para assistir</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}