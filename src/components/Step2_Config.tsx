import { useWizard } from '../context/WizardContext';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const PROFIL_LULUSAN = [
  "Keimanan dan Ketakwaan terhadap Tuhan YME", "Kewargaan", "Penalaran Kritis", "Kreativitas", 
  "Kolaborasi", "Kemandirian", "Kesehatan", "Komunikasi"
];

export function Step2Config() {
  const { rppData, updateRppData, setStep } = useWizard();

  const handleProfilToggle = (item: string) => {
    const current = rppData.profilLulusan;
    if (current.includes(item)) {
      updateRppData({ profilLulusan: current.filter(i => i !== item) });
    } else {
      updateRppData({ profilLulusan: [...current, item] });
    }
  };

  const updateIdentifikasi = (key: keyof typeof rppData.identifikasi, val: string) => {
    updateRppData({ identifikasi: { ...rppData.identifikasi, [key]: val } });
  };

  const updateKerangka = (key: keyof typeof rppData.kerangka, val: string) => {
    updateRppData({ kerangka: { ...rppData.kerangka, [key]: val } });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-t-4 border-t-orange-500 p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-orange-700">2. Pengaturan Konten Rencana Pembelajaran</h2>

      <section>
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Minimal "Tercapai"</label>
          <input 
            type="number" min="0" max="100"
            className="w-full md:w-1/3 p-2 border rounded-md" 
            value={rppData.kktpTercapaiMin} 
            onChange={e => updateRppData({ kktpTercapaiMin: parseInt(e.target.value) || 80 })} 
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Profil Lulusan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {PROFIL_LULUSAN.map(item => (
            <label key={item} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={rppData.profilLulusan.includes(item)}
                onChange={() => handleProfilToggle(item)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Identifikasi Awal Siswa</h3>
        <div className="space-y-4">
          {[
            { id: 'karakteristik', label: '1. Karakteristik Siswa' },
            { id: 'minat', label: '2. Minat Belajar' },
            { id: 'motivasi', label: '3. Motivasi Belajar' },
            { id: 'prestasi', label: '4. Prestasi Belajar' },
            { id: 'lingkungan', label: '5. Lingkungan Sekolah', placeholder: 'Contoh: Perkotaan, mayoritas siswa dari keluarga ekonomi menengah' }
          ].map(field => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                placeholder={field.placeholder}
                value={rppData.identifikasi[field.id as keyof typeof rppData.identifikasi]}
                onChange={e => updateIdentifikasi(field.id as any, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Kerangka Pembelajaran</h3>
        <div className="space-y-4">
          {[
            { id: 'kemitraan', label: 'Kemitraan Pembelajaran' },
            { id: 'lingkunganPemb', label: 'Lingkungan Pembelajaran' },
            { id: 'digitalPerencanaan', label: 'Pemanfaatan Digital (Perencanaan)' },
            { id: 'digitalPelaksanaan', label: 'Pemanfaatan Digital (Pelaksanaan)' },
            { id: 'digitalAsesmen', label: 'Pemanfaatan Digital (Asesmen)' }
          ].map(field => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                value={rppData.kerangka[field.id as keyof typeof rppData.kerangka]}
                onChange={e => updateKerangka(field.id as any, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-between pt-4">
        <button onClick={() => setStep(1)} className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50">
          <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
        </button>
        <button onClick={() => setStep(3)} className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Selanjutnya <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
