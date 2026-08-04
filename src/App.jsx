import React, { useState, useEffect } from 'react';
import { Tv, Film, Radio, Search, Settings as SettingsIcon, Mic, MicOff, Trophy, LogOut } from 'lucide-react';
import { useVoiceControl } from './hooks/useVoiceControl';
import LiveTV from './pages/LiveTV';
import Movies from './pages/Movies';
import Series from './pages/Series';
import RadiosPage from './pages/RadiosPage';
import SportsCalendar from './components/SportsCalendar';
import GlobalSearch from './pages/GlobalSearch';
import SettingsPage from './pages/Settings';

const PROFILES = [
  { id: 'p1', name: 'Principal', avatar: '👤', color: '#3B82F6' },
  { id: 'p2', name: 'Adulto', avatar: '🧑', color: '#8B5CF6' },
  { id: 'p3', name: 'Kids', avatar: '👧', color: '#10B981' },
  { id: 'p4', name: 'Família', avatar: '👨‍👩‍👧‍👦', color: '#F59E0B' },
];

// ─────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [dns, setDns] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!dns || !user || !pass) { setError('Preencha todos os campos!'); return; }
    setLoading(true);
    setError('');
    try {
      let cleanDns = dns.trim();
      if (!cleanDns.startsWith('http')) cleanDns = 'http://' + cleanDns;
      const res = await fetch(`${cleanDns}/player_api.php?username=${user}&password=${pass}`);
      const data = await res.json();
      if (data.user_info?.auth === 1) {
        const session = { dns: cleanDns, user: user.trim(), pass: pass.trim(), info: data };
        localStorage.setItem('iptv_session', JSON.stringify(session));
        onLogin(session);
      } else {
        setError('Credenciais inválidas! Verifique o servidor, usuário e senha.');
      }
    } catch (e) {
      setError('Não foi possível conectar. Verifique a URL e tente novamente.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>📺</div>
          <h1 className="gradient-text" style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>Interactive Player</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Conecte ao seu servidor IPTV</p>
        </div>

        <div className="glass" style={{ borderRadius: 24, padding: '32px 28px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>URL / Servidor DNS</label>
            <input className="input-field" placeholder="http://seu-servidor.com:8080" value={dns} onChange={e => setDns(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Usuário</label>
            <input className="input-field" placeholder="seu_usuario" value={user} onChange={e => setUser(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Senha</label>
            <input className="input-field" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          {error && (
            <div style={{ background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#F43F5E', marginBottom: 20 }}>
              {error}
            </div>
          )}
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 12 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <div className="spinner" style={{ width: 20, height: 20 }} /> : '🚀 Conectar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PROFILE SELECT
// ─────────────────────────────────────────────
function ProfileSelect({ onSelectProfile }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40 }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Quem está assistindo?</h2>
        <p style={{ color: 'var(--text-muted)' }}>Selecione seu perfil</p>
      </div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {PROFILES.map(p => (
          <button
            key={p.id}
            onClick={() => onSelectProfile(p)}
            style={{ background: 'rgba(255,255,255,0.04)', border: `2px solid ${p.color}20`, borderRadius: 20, padding: '24px 28px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: 130, transition: 'all 0.2s', color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${p.color}15`; e.currentTarget.style.borderColor = p.color; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = `${p.color}20`; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ fontSize: 48 }}>{p.avatar}</div>
            <div style={{ fontWeight: 800, fontSize: 14 }}>{p.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
function Dashboard({ session, currentProfile, onSetScreen, onLogout, onVoiceClick, isListening, voiceFeedback }) {
  const navItems = [
    { id: 'livetv',   label: 'TV Ao Vivo',     icon: <Tv size={28} />,          color: '#3B82F6', bg: 'rgba(59,130,246,0.15)',  desc: 'Canais ao vivo' },
    { id: 'movies',   label: 'Filmes',          icon: <Film size={28} />,         color: '#E11D48', bg: 'rgba(225,29,72,0.15)',   desc: 'Vídeo sob demanda' },
    { id: 'series',   label: 'Séries',          icon: '🍿',                       color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', desc: 'Episódios e temporadas', isEmoji: true },
    { id: 'radios',   label: 'Rádios',          icon: <Radio size={28} />,        color: '#10B981', bg: 'rgba(16,185,129,0.15)', desc: 'Rádio ao vivo' },
    { id: 'calendar', label: 'Jogos do Dia',    icon: <Trophy size={28} />,       color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', desc: 'Futebol ao vivo' },
    { id: 'search',   label: 'Busca Global',    icon: <Search size={28} />,       color: '#06B6D4', bg: 'rgba(6,182,212,0.15)',  desc: 'Pesquisar tudo' },
    { id: 'settings', label: 'Configurações',   icon: <SettingsIcon size={28} />, color: '#64748B', bg: 'rgba(100,116,139,0.15)', desc: 'Ajustes do app' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 30%, rgba(59,130,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />

      {/* Top Bar */}
      <div style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>📺</span>
          <div>
            <h1 className="gradient-text" style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>Interactive Player</h1>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>IPTV Premium</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onVoiceClick}
            style={{ background: isListening ? 'rgba(225,29,72,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${isListening ? 'rgba(225,29,72,0.5)' : 'var(--border)'}`, borderRadius: 12, padding: '10px 16px', color: isListening ? '#F43F5E' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            {isListening ? 'Ouvindo...' : 'Voz'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '8px 16px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 20 }}>{currentProfile?.avatar}</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{currentProfile?.name}</span>
          </div>
          <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Voice Feedback Toast */}
      {voiceFeedback && (
        <div style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: '12px 24px', fontSize: 14, fontWeight: 600, color: 'white', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1000, animation: 'fadeInPage 0.3s ease', whiteSpace: 'nowrap' }}>
          🎤 {voiceFeedback}
        </div>
      )}

      {/* Navigation Grid */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, width: '100%', maxWidth: 1100 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onSetScreen(item.id)}
              style={{ background: item.bg, border: `1px solid ${item.color}25`, borderRadius: 20, padding: '28px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'white', transition: 'all 0.25s ease', textAlign: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.borderColor = item.color; e.currentTarget.style.boxShadow = `0 8px 30px ${item.color}25`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.borderColor = `${item.color}25`; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.isEmoji ? <span style={{ fontSize: 28 }}>{item.icon}</span> : item.icon}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('iptv_session')); } catch { return null; }
  });
  const [currentProfile, setCurrentProfile] = useState(null);
  const [screen, setScreen] = useState('dashboard');
  const [voiceChannelSearch, setVoiceChannelSearch] = useState('');
  const [voiceMovieSearch, setVoiceMovieSearch] = useState('');
  const [voiceSeriesSearch, setVoiceSeriesSearch] = useState('');
  const [voiceRadioSearch, setVoiceRadioSearch] = useState('');
  const [forcedChannel, setForcedChannel] = useState(null);

  const { isListening, feedbackMsg, toggleListening } = useVoiceControl({
    setScreen,
    setVoiceChannelSearch,
    setVoiceMovieSearch,
    setVoiceSeriesSearch,
    setVoiceRadioSearch,
    onCloseModal: () => {},
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setScreen('dashboard');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('iptv_session');
    setSession(null);
    setCurrentProfile(null);
    setScreen('dashboard');
  };

  // ── AUTH GATES ──
  if (!session) return <LoginScreen onLogin={(s) => { setSession(s); }} />;
  if (!currentProfile) return <ProfileSelect onSelectProfile={(p) => setCurrentProfile(p)} />;

  // ── SCREEN ROUTING ──
  const goBack = () => setScreen('dashboard');

  if (screen === 'livetv') return (
    <LiveTV session={session} voiceSearch={voiceChannelSearch} forcedChannel={forcedChannel}
      onBack={() => { setVoiceChannelSearch(''); setForcedChannel(null); goBack(); }} />
  );
  if (screen === 'movies') return (
    <Movies session={session} voiceSearch={voiceMovieSearch}
      onBack={() => { setVoiceMovieSearch(''); goBack(); }} />
  );
  if (screen === 'series') return (
    <Series session={session} voiceSearch={voiceSeriesSearch}
      onBack={() => { setVoiceSeriesSearch(''); goBack(); }} />
  );
  if (screen === 'radios') return (
    <RadiosPage session={session} voiceSearch={voiceRadioSearch}
      onBack={() => { setVoiceRadioSearch(''); goBack(); }} />
  );
  if (screen === 'calendar') return (
    <SportsCalendar session={session} onBack={goBack}
      onPlayLive={(id, name) => { setForcedChannel(id); setVoiceChannelSearch(name); setScreen('livetv'); }} />
  );
  if (screen === 'search') return (
    <GlobalSearch session={session} onBack={goBack}
      onPlayLive={(id) => { setForcedChannel(id); setScreen('livetv'); }} />
  );
  if (screen === 'settings') return (
    <SettingsPage
      session={session}
      currentProfile={currentProfile}
      onBack={goBack}
      onSaveSession={(s) => { setSession(s); localStorage.setItem('iptv_session', JSON.stringify(s)); }}
      onSaveProfile={(p) => setCurrentProfile(p)}
    />
  );

  // ── DEFAULT: DASHBOARD ──
  return (
    <Dashboard
      session={session}
      currentProfile={currentProfile}
      onSetScreen={setScreen}
      onLogout={handleLogout}
      onVoiceClick={toggleListening}
      isListening={isListening}
      voiceFeedback={feedbackMsg}
    />
  );
}