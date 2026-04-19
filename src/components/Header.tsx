import { useState, FormEvent } from 'react';
import { useSettings } from '../context/SettingsContext';
import { AdminPanel } from './AdminPanel';

export function Header() {
  const { settings, isAdminMode, setAdminMode } = useSettings();
  const [clickCount, setClickCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleHiddenClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      if (!isAdminMode) {
        setShowLogin(true);
      }
      setClickCount(0);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'admin') {
      setAdminMode(true);
      setShowLogin(false);
      setUser('');
      setPass('');
    } else {
      alert('Username atau Password salah!');
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-50 to-white shadow-sm border-b relative z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-default select-none group"
            onClick={handleHiddenClick}
            title="Sistem Generator Modul Ajar Berbasis AI"
          >
            <img src="https://lh3.googleusercontent.com/d/1FV7EmCnGHRbpQvbbdrRv-t0KZCUXbIqk" alt="SIGMA Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <div className="flex flex-col text-blue-800">
              <span className="text-2xl md:text-3xl font-extrabold leading-none tracking-tight">SIGMA</span>
              <span className="text-[10px] sm:text-xs md:text-sm font-semibold opacity-90 leading-tight">Sistem Modul Ajar Berbasis AI</span>
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            {isAdminMode && (
              <button 
                onClick={() => setAdminMode(false)}
                className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-medium"
              >
                Exit Admin
              </button>
            )}
            <button 
              onClick={() => !isAdminMode && setShowLogin(true)}
              className="text-sm px-4 py-2 border border-transparent rounded-md text-transparent bg-transparent hover:bg-black/5 cursor-pointer select-none"
            >
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Marquee */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-yellow-300 py-2 overflow-hidden border-b-4 border-green-500 shadow-md">
        <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] inline-block">
          <span className="font-semibold px-4 drop-shadow-sm">{settings.marqueeText}</span>
          <span className="font-semibold px-4 ml-96 drop-shadow-sm">{settings.marqueeText}</span>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">Admin Login</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input type="text" value={user} onChange={e=>setUser(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" value={pass} onChange={e=>setPass(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowLogin(false)} className="px-4 py-2 hover:bg-gray-100 rounded">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel Modal shown when in Admin Mode */}
      {isAdminMode && <AdminPanel onClose={() => setAdminMode(false)} />}
    </>
  );
}
