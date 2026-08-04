import React, { useState } from 'react';
import { ArrowLeft, Settings as SettingsIcon, Save, User, Lock, Globe, Monitor, ChevronRight } from 'lucide-react';

export default function Settings({ session, currentProfile, onBack, onSaveSession, onSaveProfile }) {
  const [dns, setDns] = useState(session?.url || '');
  const [username, setUsername] = useState(session?.username || '');
  const [password, setPassword] = useState(session?.password || '');
  const [profileName, setProfileName] = useState(currentProfile?.name || 'Perfil 1');
  const [selectedAvatar, setSelectedAvatar] = useState(currentProfile?.avatar || 1);
  const [language, setLanguage] = useState('pt-BR');
  const [darkMode, setDarkMode] = useState(true);
  const [parentalControl, setParentalControl] = useState(false);

  const avatars = [1, 2, 3, 4, 5, 6];

  const handleSaveSession = () => {
    if (onSaveSession) {
      onSaveSession({ url: dns, username, password });
    }
  };

  const handleSaveProfile = () => {
    if (onSaveProfile) {
      onSaveProfile({ name: profileName, avatar: selectedAvatar });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <SettingsIcon size={32} className="text-blue-500" />
            Configurações
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Servidor Xtream */}
          <section className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Globe size={20} className="text-blue-400" />
              Servidor IPTV
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">DNS / URL</label>
                <input type="text" value={dns} onChange={e => setDns(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="http://exemplo.com:80" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Usuário</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Senha</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition" />
              </div>
              <button onClick={handleSaveSession} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition">
                <Save size={18} /> Salvar Servidor
              </button>
            </div>
          </section>

          {/* Perfil */}
          <section className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User size={20} className="text-purple-400" />
              Perfil
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-3">Avatar</label>
                <div className="flex gap-3 flex-wrap">
                  {avatars.map(id => (
                    <div
                      key={id}
                      onClick={() => setSelectedAvatar(id)}
                      className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-all ${selectedAvatar === id ? 'border-purple-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} alt={`Avatar ${id}`} className="w-full h-full rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome do Perfil</label>
                <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition" />
              </div>
              <button onClick={handleSaveProfile} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition">
                <Save size={18} /> Salvar Perfil
              </button>
            </div>
          </section>

          {/* Preferências */}
          <section className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-xl md:col-span-2">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Monitor size={20} className="text-green-400" />
              Preferências do App
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                <div>
                  <div className="font-medium">Idioma</div>
                  <div className="text-sm text-gray-400">Português (Brasil)</div>
                </div>
                <ChevronRight size={20} className="text-gray-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <Lock size={16} /> Controle Parental
                  </div>
                  <div className="text-sm text-gray-400">Bloquear conteúdo adulto</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={parentalControl} onChange={e => setParentalControl(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Sobre */}
          <section className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-xl md:col-span-2 text-center text-gray-400 text-sm">
            <p>Versão 1.0.0</p>
            <p className="mt-1">© 2026 Interactive IPTV App. Todos os direitos reservados.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
