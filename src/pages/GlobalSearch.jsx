import React, { useState, useEffect } from 'react';
import { Search, Tv, Film, Star, ArrowLeft } from 'lucide-react';
import { getLiveStreams, getVodStreams, getSeriesStreams } from '../services/xtreamApi';

export default function GlobalSearch({ session, onBack, initialQuery = '', onPlayLive, onPlayVod, onOpenSeries }) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ live: [], vod: [], series: [] });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else {
        setResults({ live: [], vod: [], series: [] });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const [live, vod, series] = await Promise.all([
        getLiveStreams(session),
        getVodStreams(session),
        getSeriesStreams(session)
      ]);

      const q = query.toLowerCase();
      
      const filteredLive = (live || []).filter(item => item.name.toLowerCase().includes(q)).slice(0, 10);
      const filteredVod = (vod || []).filter(item => item.name.toLowerCase().includes(q)).slice(0, 10);
      const filteredSeries = (series || []).filter(item => item.name.toLowerCase().includes(q)).slice(0, 10);

      setResults({ live: filteredLive, vod: filteredVod, series: filteredSeries });
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  const hasResults = results.live.length > 0 || results.vod.length > 0 || results.series.length > 0;

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4 bg-gray-900/60 p-4 rounded-2xl border border-gray-800 shadow-xl backdrop-blur-sm">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar canais, filmes ou séries..."
              className="w-full bg-transparent border-none pl-12 pr-4 py-3 text-xl focus:outline-none focus:ring-0 placeholder-gray-500"
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && query.length >= 2 && !hasResults && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
            <Search size={64} className="opacity-20" />
            <p className="text-xl">Nenhum resultado encontrado para "{query}"</p>
          </div>
        )}

        {!loading && hasResults && (
          <div className="space-y-10">
            {/* Live */}
            {results.live.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Tv className="text-blue-400" /> Canais
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {results.live.map(item => (
                    <div key={item.stream_id} className="bg-gray-800/40 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer border border-gray-700/50 group" onClick={() => onPlayLive && onPlayLive(item)}>
                      <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                        {item.stream_icon ? <img src={item.stream_icon} alt={item.name} className="w-full h-full object-contain p-2" /> : <Tv size={32} className="text-gray-600" />}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <div className="bg-blue-600 rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition">
                            <Star size={20} className="text-white" fill="white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* VOD */}
            {results.vod.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Film className="text-purple-400" /> Filmes
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {results.vod.map(item => (
                    <div key={item.stream_id} className="bg-gray-800/40 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer border border-gray-700/50 group" onClick={() => onPlayVod && onPlayVod(item)}>
                      <div className="aspect-[2/3] bg-gray-900 relative">
                        {item.stream_icon ? <img src={item.stream_icon} alt={item.name} className="w-full h-full object-cover" /> : <Film size={48} className="text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <div className="bg-purple-600 rounded-full p-4 shadow-lg transform scale-90 group-hover:scale-100 transition">
                            <Star size={24} className="text-white" fill="white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Series */}
            {results.series.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Star className="text-yellow-400" /> Séries
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {results.series.map(item => (
                    <div key={item.series_id} className="bg-gray-800/40 rounded-xl overflow-hidden hover:scale-105 transition cursor-pointer border border-gray-700/50 group" onClick={() => onOpenSeries && onOpenSeries(item)}>
                      <div className="aspect-[2/3] bg-gray-900 relative">
                        {item.cover ? <img src={item.cover} alt={item.name} className="w-full h-full object-cover" /> : <Star size={48} className="text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <div className="bg-yellow-500 rounded-full p-4 shadow-lg transform scale-90 group-hover:scale-100 transition text-black">
                            Ver
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
