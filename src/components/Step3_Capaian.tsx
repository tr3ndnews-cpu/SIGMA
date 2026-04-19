import { useState } from 'react';
import { useWizard } from '../context/WizardContext';
import { useSettings } from '../context/SettingsContext';
import { generateContentWithFailover } from '../lib/gemini';
import { ChevronRight, ChevronLeft, Loader2, Sparkles } from 'lucide-react';

export function Step3Capaian() {
  const { rppData, updateRppData, setStep } = useWizard();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!rppData.cpMateri.trim()) {
      setError("Silakan masukkan materi pokok atau capaian pembelajaran terlebih dahulu.");
      return;
    }
    
    setLoading(true);
    setError('');

    const prompt = `Anda adalah seorang ahli kurikulum pendidikan Indonesia. Analisis kalimat Capaian Pembelajaran (CP) berikut: "${rppData.cpMateri}". Identifikasi setiap materi pokok yang utuh dan berbeda di dalamnya. Jangan hanya memecah berdasarkan koma jika masih dalam satu kesatuan ide.
        
Untuk setiap materi pokok yang teridentifikasi, buatkan 3 Tujuan Pembelajaran (TP) sesuai level kognitif: Memahami, Mengaplikasi, dan Merefleksi.
        
Example 1: Topik utama "berbagai model jaringan komputer", hasilnya:
- Memahami: Menjelaskan konsep dasar dan karakteristik berbagai model jaringan komputer.
- Mengaplikasi: Mengidentifikasi dan mengklasifikasikan model jaringan komputer dalam skenario nyata.
- Merefleksi: Mengevaluasi kelebihan dan kekurangan berbagai model jaringan komputer.

Berikan jawaban dalam format JSON. Array objek, di mana setiap objek memiliki kunci "topic" (string) dan "tps" (array dari 3 objek: { "level": string, "text": string }).`;

    const schema = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          "topic": { "type": "STRING" },
          "tps": {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                "level": { "type": "STRING" },
                "text": { "type": "STRING" }
              },
              required: ["level", "text"]
            }
          }
        },
        required: ["topic", "tps"]
      }
    };

    try {
      const apiKeys = settings.apiKeys.filter(k => k.trim());
      const res = await generateContentWithFailover(prompt, apiKeys, schema);
      updateRppData({ tujuanPembelajaran: res });
      setStep(4);
    } catch (err: any) {
      setError(err.message || "Gagal menghasilkan konten. Periksa API Key atau koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-t-4 border-t-purple-500 p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-purple-700">3. Capaian Pembelajaran / Materi</h2>
      <p className="text-gray-600 mb-6">Masukkan deskripsi singkat atau materi pembelajaran, lalu AI akan merumuskan Tujuan Pembelajaran.</p>
      
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Materi Pokok / Capaian Pembelajaran</label>
        <textarea
          rows={5}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all"
          placeholder="Contoh: Mengenali berbagai model jaringan komputer, dan melakukan pengiriman data antarperangkat."
          value={rppData.cpMateri}
          onChange={e => updateRppData({ cpMateri: e.target.value })}
        />
      </div>

      <hr className="border-0 h-[2px] bg-gradient-to-r from-purple-200 via-pink-200 to-transparent" />

      <div className="flex justify-between pt-4">
        <button onClick={() => setStep(2)} className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50" disabled={loading}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
        </button>
        {loading ? (
          <div className="flex items-center text-blue-600 font-medium px-6 py-2">
            <div className="w-10 h-10 relative mr-4">
              <div className="loader absolute-center" style={{ transform: 'scale(0.5) rotate(165deg)', top: 0, left: 0 }}></div>
            </div>
            AI Sedang Menghasilkan...
          </div>
        ) : (
          <button 
            onClick={handleGenerate} 
            className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 mr-2" /> Generate Tujuan Pembelajaran
          </button>
        )}
      </div>
    </div>
  );
}
