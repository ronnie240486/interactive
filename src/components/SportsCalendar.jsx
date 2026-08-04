import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Play } from 'lucide-react';
import { getLiveStreams } from '../services/xtreamApi';

export default function SportsCalendar({ session, onBack, onPlayLive }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const cleanTeamTitle = (name) => {
    if (!name) return '';
    return name
      .replace(/^\d{1,2}[Hh]\d{2}\s*/i, '')
      .replace(/^[Hh]\d{2}\s*/i, '')
      .replace(/^\d{1,2}[Hh]\s*/i, '')
      .replace(/^BR:\s*/i, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .trim();
  };

  useEffect(() => {
    async function load() {
      if (!session) { setLoading(false); return; }
      try {
        const streams = await getLiveStreams(session.dns, session.user, session.pass, null);
        const now = new Date();
        const nowMin = now.getHours() * 60 + now.getMinutes();
        const sports = (streams || []).filter(s => {
          const n = (s.name || '').toLowerCase();
          return n.includes(' x ') || n.includes(' vs ') || n.includes('futebol') || n.includes('copa') || n.includes('champions');
        });

        const formatted = sports.slice(0, 24).map(s => {
          const rawName = s.name || '';
          const matchTime = rawName.match(/(\d{1,2}):(\d{2})/);
          let gameTimeStr = null;
          let isLiveNow = false;

          if (matchTime) {
            gameTimeStr = `${matchTime[1].padStart(2, '0')}:${matchTime[2]}`;
            const gameMin = parseInt(matchTime[1]) * 60 + parseInt(matchTime[2]);
            isLiveNow = nowMin >= gameMin - 5 && nowMin <= gameMin + 115;
          }

          const parts = rawName.split(/ x | vs /i);
          const home = cleanTeamTitle(parts[0] || 'Time A');
          const away = cleanTeamTitle(parts[1] || 'Time B');

          return { id: s.stream_id, home, away, time: gameTimeStr, isLive: isLiveNow, streamId: s.stream_id, channel: s.stream_icon };
        });

        setMatches(formatted);
      } catch (e) {}
      setLoading(false);
    }
    load();
  }, [session]);

  return (
    <div className="page-transition" style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
      <div style={{ padding: '14px 30px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border)', background: 'rgba(7,11,20,0.9)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ padding: '8px 16px', gap: 6 }}><ArrowLeft size={16} /> Voltar</button>
        <Trophy size={20} color="var(--accent-yellow)" />
        <span style={{ fontWeight: 800, fontSize: 18 }}>Jogos do Dia</span>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 30px' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}><div className="spinner" /></div>
        ) : matches.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 80 }}>
            <Trophy size={64} color="rgba(255,255,255,0.08)" style={{ marginBottom: 16 }} />
            <p>Nenhum jogo encontrado para hoje</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {matches.map(m => (
              <div key={m.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`tag ${m.isLive ? 'tag-live live-badge' : 'tag-soon'}`}>
                    {m.isLive ? '🔴 AO VIVO' : 'HOJE'}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {m.time ? `${m.time}` : 'Em breve'}
                  </span>
                </div>

                {/* Teams */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '8px 0' }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.3 }}>{m.home}</div>
                  </div>
                  <div style={{ padding: '6px 14px', background: 'rgba(245,158,11,0.15)', borderRadius: 8, fontWeight: 900, fontSize: 13, color: 'var(--accent-yellow)', margin: '0 10px' }}>
                    VS
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.3 }}>{m.away}</div>
                  </div>
                </div>

                {/* Button */}
                <button onClick={() => onPlayLive && onPlayLive(m.streamId, m.home)} className="btn btn-primary" style={{ width: '100%', gap: 8, padding: '10px 16px' }}>
                  <Play size={15} />
                  {m.time ? `Ver Canal às ${m.time}` : 'Ver Canal'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}