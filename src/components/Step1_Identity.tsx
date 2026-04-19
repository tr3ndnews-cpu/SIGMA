import { useEffect, useState } from 'react';
import { useWizard } from '../context/WizardContext';
import { useSettings } from '../context/SettingsContext';
import { ChevronRight } from 'lucide-react';

const JENJANG = ['SD'];

const KELAS_OPTIONS: Record<string, string[]> = {
  'SD': ['I / Ganjil', 'I / Genap', 'II / Ganjil', 'II / Genap', 'III / Ganjil', 'III / Genap', 'IV / Ganjil', 'IV / Genap', 'V / Ganjil', 'V / Genap', 'VI / Ganjil', 'VI / Genap']
};

const FASE_OPTIONS: Record<string, string[]> = {
  'SD': ['A', 'B', 'C']
};

const ALOKASI_WAKTU = [
  '1 JP x 30 Menit', '2 JP x 30 Menit', '3 JP x 30 Menit',
  '1 JP x 35 Menit', '2 JP x 35 Menit', '3 JP x 35 Menit', '4 JP x 35 Menit',
  '1 JP x 40 Menit', '2 JP x 40 Menit', '3 JP x 40 Menit',
  '1 JP x 45 Menit', '2 JP x 45 Menit', '3 JP x 45 Menit', '4 JP x 45 Menit', '5 JP x 45 Menit'
];

export function Step1Identity() {
  const { rppData, updateRppData, setStep } = useWizard();
  const { settings } = useSettings();
  
  // Apply defaults if empty
  useEffect(() => {
    if (!rppData.namaSekolah && settings.defaultSekolah) updateRppData({ namaSekolah: settings.defaultSekolah });
    if (!rppData.namaKepsek && settings.defaultKepsek) updateRppData({ namaKepsek: settings.defaultKepsek });
    if (!rppData.namaGuru && settings.defaultGuru) updateRppData({ namaGuru: settings.defaultGuru });
    if (!rppData.mapel && settings.defaultMapel) updateRppData({ mapel: settings.defaultMapel });
    if (!rppData.kota && settings.defaultKota) updateRppData({ kota: settings.defaultKota });
  }, [settings]);

  const [errors, setErrors] = useState<string[]>([]);

  const handleNext = () => {
    const err = [];
    if (!rppData.namaSekolah) err.push("Nama Sekolah diperlukan");
    if (!rppData.jenjang) err.push("Jenjang Sekolah diperlukan");
    if (!rppData.mapel) err.push("Mata Pelajaran diperlukan");
    if (!rppData.tahunPelajaran) err.push("Tahun Pelajaran diperlukan");
    if (!rppData.kelasSemester) err.push("Kelas / Semester diperlukan");
    if (!rppData.fase) err.push("Fase diperlukan");
    if (!rppData.alokasiWaktu) err.push("Alokasi Waktu diperlukan");
    if (!rppData.namaGuru) err.push("Nama Guru diperlukan");
    if (!rppData.namaKepsek) err.push("Nama Kepala Sekolah diperlukan");
    if (!rppData.kota) err.push("Kota diperlukan");
    
    if (err.length > 0) {
      setErrors(err);
      return;
    }
    setStep(2);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-t-4 border-t-blue-500 p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">1. Identitas Rencana Pembelajaran</h2>
      
      {errors.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center transform transition-all">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Data Belum Lengkap</h3>
            <p className="text-gray-500 mb-4 text-sm">Silakan lengkapi kolom-kolom berikut sebelum melanjutkan:</p>
            <ul className="text-left bg-red-50 text-red-700 rounded-lg p-4 mb-6 space-y-1 text-sm font-medium">
              {errors.map((err, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setErrors([])}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">a. Nama Sekolah</label>
          <input className="w-full p-2 border rounded-md bg-gray-50 text-gray-800" value={rppData.namaSekolah} disabled />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">b. Jenjang Sekolah</label>
          <select 
            className="w-full p-2 border rounded-md" 
            value={rppData.jenjang} 
            onChange={e => updateRppData({ jenjang: e.target.value, kelasSemester: '', fase: '' })}
          >
            <option value="">Pilih Jenjang</option>
            {JENJANG.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">c. Mata Pelajaran</label>
          <input className="w-full p-2 border rounded-md" value={rppData.mapel} onChange={e => updateRppData({ mapel: e.target.value })} placeholder="Contoh: Informatika" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">d. Tahun Pelajaran</label>
          <input className="w-full p-2 border rounded-md" value={rppData.tahunPelajaran} onChange={e => updateRppData({ tahunPelajaran: e.target.value })} placeholder="Contoh: 2025/2026" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">e. Kelas / Semester</label>
          <select className="w-full p-2 border rounded-md" value={rppData.kelasSemester} onChange={e => updateRppData({ kelasSemester: e.target.value })} disabled={!rppData.jenjang}>
            <option value="">Pilih Kelas/Semester</option>
            {rppData.jenjang && KELAS_OPTIONS[rppData.jenjang]?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">f. Fase</label>
           <select className="w-full p-2 border rounded-md" value={rppData.fase} onChange={e => updateRppData({ fase: e.target.value })} disabled={!rppData.jenjang}>
            <option value="">Pilih Fase</option>
            {rppData.jenjang && FASE_OPTIONS[rppData.jenjang]?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">g. Alokasi Waktu</label>
          <select className="w-full p-2 border rounded-md" value={rppData.alokasiWaktu} onChange={e => updateRppData({ alokasiWaktu: e.target.value })}>
            <option value="">Pilih Alokasi Waktu</option>
            {ALOKASI_WAKTU.map(aw => <option key={aw} value={aw}>{aw}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">h. Nama Guru / NIP</label>
          <input className="w-full p-2 border rounded-md" value={rppData.namaGuru} onChange={e => updateRppData({ namaGuru: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">i. Nama Kepala Sekolah / NIP</label>
          <input className="w-full p-2 border rounded-md bg-gray-50 text-gray-800" value={rppData.namaKepsek} disabled />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">j. Kota</label>
          <input className="w-full p-2 border rounded-md" value={rppData.kota} onChange={e => updateRppData({ kota: e.target.value })} placeholder="Contoh: Beji" />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={handleNext} className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Selanjutnya <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
