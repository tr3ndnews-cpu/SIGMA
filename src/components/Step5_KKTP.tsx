import { useWizard } from '../context/WizardContext';
import { ChevronRight, ChevronLeft, Printer } from 'lucide-react';
import { printSection } from '../lib/print';

export function Step5KKTP() {
  const { rppData, setStep } = useWizard();
  
  const allTps = rppData.tujuanPembelajaran.flatMap(g => g.tps);
  const tercapaiMin = rppData.kktpTercapaiMin;
  const hampirTercapaiMin = Math.max(0, tercapaiMin - 10);
  const belumTercapaiMax = Math.max(0, hampirTercapaiMin - 1);

  const kktpCriteria: Record<string, string> = {
    'Memahami': "Kemampuan menjelaskan konsep dasar, karakteristik, dan fungsi utama dengan benar.",
    'Mengaplikasi': "Kemampuan mengklasifikasikan contoh nyata atau menggambarkan alur proses secara logis dan tepat.",
    'Merefleksi': "Kemampuan memberikan evaluasi kritis, membandingkan, dan menyajikan rekomendasi yang beralasan."
  };

  const handlePrint = () => {
    printSection('kktp-print-area', 'Kriteria Ketercapaian Tujuan Pembelajaran', rppData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-t-4 border-t-yellow-500 p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-700">5. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)</h2>
        <button onClick={handlePrint} className="text-sm px-3 py-1 flex items-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700">
          <Printer className="w-4 h-4 mr-1" /> Cetak
        </button>
      </div>

      <div id="kktp-print-area" className="space-y-6 overflow-x-auto">
        <table className="w-full text-left text-sm border">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 w-1/3">Tujuan Pembelajaran</th>
              <th className="p-3 w-1/3">Kriteria Ketercapaian</th>
              <th className="p-3">Interval Nilai & Deskripsi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {allTps.map((tp: any, idx: number) => (
              <tr key={idx}>
                <td className="p-3 border-r">{tp.text}</td>
                <td className="p-3 border-r">{kktpCriteria[tp.level]}</td>
                <td className="p-3">
                  <div className="space-y-1">
                    <div><strong>{tercapaiMin} - 100:</strong> Tercapai</div>
                    <div className="text-gray-600"><strong>{hampirTercapaiMin} - {tercapaiMin - 1}:</strong> Hampir Tercapai</div>
                    <div className="text-gray-500"><strong>0 - {belumTercapaiMax}:</strong> Belum Tercapai</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-bold text-lg text-blue-800">Kesimpulan Kriteria Ketercapaian</h4>
          <p className="mt-2 text-gray-700">
            Peserta didik dianggap telah mencapai Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) apabila memperoleh <strong>nilai minimal {tercapaiMin}</strong> pada asesmen yang diberikan.
          </p>
          <p className="mt-2 text-gray-700">
            <strong>Tindak Lanjut:</strong> Bagi peserta didik yang belum mencapai KKTP (nilai di bawah {tercapaiMin}), guru akan memberikan program remedial berupa pembelajaran ulang dengan metode yang berbeda, tutor sebaya, atau pemberian tugas tambahan yang terstruktur untuk membantu mereka mencapai kompetensi yang diharapkan.
          </p>
        </div>
      </div>

      <hr className="border-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-300 to-transparent my-6" />

      <div className="flex justify-between pt-2">
        <button onClick={() => setStep(4)} className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50">
          <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
        </button>
        <button onClick={() => setStep(6)} className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Buat RPP Lengkap <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
