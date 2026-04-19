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
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 whitespace-pre-line text-sm">
          {errors.join('\n')}
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
