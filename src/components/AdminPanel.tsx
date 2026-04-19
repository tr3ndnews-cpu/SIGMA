import { useState, FormEvent } from 'react';
import { useSettings } from '../context/SettingsContext';
import { X, Save } from 'lucide-react';

export function AdminPanel({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-4 text-blue-700">Pengaturan Umum</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teks Animasi Berjalan (Marquee)</label>
                <input
                  type="text"
                  value={formData.marqueeText}
                  onChange={e => setFormData({ ...formData, marqueeText: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Nama Sekolah</label>
                <input
                  type="text"
                  value={formData.defaultSekolah}
                  onChange={e => setFormData({ ...formData, defaultSekolah: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Nama Kepala Sekolah / NIP</label>
                <input
                  type="text"
                  value={formData.defaultKepsek}
                  onChange={e => setFormData({ ...formData, defaultKepsek: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Nama Guru</label>
                <input
                  type="text"
                  value={formData.defaultGuru}
                  onChange={e => setFormData({ ...formData, defaultGuru: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Mata Pelajaran</label>
                <input
                  type="text"
                  value={formData.defaultMapel}
                  onChange={e => setFormData({ ...formData, defaultMapel: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Kota</label>
                <input
                  type="text"
                  value={formData.defaultKota}
                  onChange={e => setFormData({ ...formData, defaultKota: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-blue-700">Konfigurasi Supabase (Opsional)</h3>
            <p className="text-sm text-gray-500 mb-4">Jika diisi, pengaturan admin ini akan disimpan dan disinkronkan dari database Supabase Anda (tabel <code>admin_settings</code>).</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supabase URL</label>
                <input
                  type="text"
                  value={formData.supabaseUrl}
                  onChange={e => setFormData({ ...formData, supabaseUrl: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  placeholder="https://xxxxx.supabase.co"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supabase Anon Key</label>
                <input
                  type="password"
                  value={formData.supabaseKey}
                  onChange={e => setFormData({ ...formData, supabaseKey: e.target.value })}
                  className="w-full p-2 border rounded-md font-mono text-sm"
                  placeholder="eyJh..."
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-blue-700">Konfigurasi AI Provider (Gemini & OpenRouter)</h3>
            <p className="text-sm text-gray-500 mb-4">Batasi model dan kontrol limit (temperature/tokens) dari platform AI yang akan digunakan.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider Aktif</label>
                <select
                  value={formData.activeProvider}
                  onChange={e => setFormData({ ...formData, activeProvider: e.target.value as 'gemini' | 'openrouter' })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="gemini">Google Gemini AI</option>
                  <option value="openrouter">OpenRouter AI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OpenRouter API Key</label>
                <input
                  type="password"
                  value={formData.openRouterApiKey}
                  onChange={e => setFormData({ ...formData, openRouterApiKey: e.target.value })}
                  className="w-full p-2 border rounded-md font-mono text-sm"
                  placeholder="sk-or-v1-..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gemini Model</label>
                <input
                  type="text"
                  value={formData.geminiModel}
                  onChange={e => setFormData({ ...formData, geminiModel: e.target.value })}
                  className="w-full p-2 border rounded-md font-mono text-sm"
                  placeholder="gemini-2.0-flash"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OpenRouter Model</label>
                <input
                  type="text"
                  value={formData.openRouterModel}
                  onChange={e => setFormData({ ...formData, openRouterModel: e.target.value })}
                  className="w-full p-2 border rounded-md font-mono text-sm"
                  placeholder="google/gemini-2.5-flash"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature ({formData.aiTemperature})</label>
                <input
                  type="range"
                  min="0" max="2" step="0.1"
                  value={formData.aiTemperature}
                  onChange={e => setFormData({ ...formData, aiTemperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                <input
                  type="number"
                  value={formData.aiMaxTokens}
                  onChange={e => setFormData({ ...formData, aiMaxTokens: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                  placeholder="2000"
                />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-4 text-blue-700 mt-6">Konfigurasi API Keys Failover (Gemini)</h3>
            <p className="text-sm text-gray-500 mb-4">Aplikasi akan mencoba key secara berurutan apabila terjadi kesalahan limit quota (Hanya untuk Gemini).</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.apiKeys.map((key, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key {idx + 1}</label>
                  <input
                    type="password"
                    value={key}
                    onChange={e => {
                      const newKeys = [...formData.apiKeys];
                      newKeys[idx] = e.target.value;
                      setFormData({ ...formData, apiKeys: newKeys });
                    }}
                    className="w-full p-2 border rounded-md font-mono text-sm"
                    placeholder="AIzaSy..."
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end pt-4 border-t">
            <button type="submit" className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
