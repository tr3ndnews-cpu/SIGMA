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
        <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 shadow-2xl transition-all">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm border-t-4 border-t-yellow-500 shadow-2xl transform overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10"></div>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-3 shadow-inner">
                <img src="https://lh3.googleusercontent.com/d/1FV7EmCnGHRbpQvbbdrRv-t0KZCUXbIqk" alt="SIGMA Logo" className="w-10 h-10 object-contain drop-shadow" />
              </div>
              <h3 className="text-2xl font-extrabold text-blue-800 tracking-tight">Admin Portal</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Sistem Modul Ajar SIGMA</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                <input 
                  type="text" 
                  value={user} 
                  onChange={e=>setUser(e.target.value)} 
                  className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-0 p-2.5 rounded-lg transition-colors outline-none bg-gray-50 focus:bg-white" 
                  placeholder="Masukkan username"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input 
                  type="password" 
                  value={pass} 
                  onChange={e=>setPass(e.target.value)} 
                  className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-0 p-2.5 rounded-lg transition-colors outline-none bg-gray-50 focus:bg-white" 
                  placeholder="••••••••"
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowLogin(false)} 
                  className="w-full sm:w-auto px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Kembali
                </button>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white font-bold rounded-lg hover:from-blue-800 hover:to-blue-700 shadow-md transform transition-all active:scale-95"
                >
                  Masuk
                </button>
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
