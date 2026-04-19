import { useWizard } from '../context/WizardContext';
import { ChevronRight, ChevronLeft, Printer } from 'lucide-react';
import { printSection } from '../lib/print';

export function Step4TPATP() {
  const { rppData, setStep } = useWizard();

  const handlePrintTP = () => {
    printSection('tp-print-area', 'Tujuan Pembelajaran', rppData);
  };
  
  const handlePrintATP = () => {
    printSection('atp-print-area', 'Alur Tujuan Pembelajaran', rppData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-t-4 border-t-pink-500 p-6 space-y-8">
      
      {/* TP Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-pink-700">Tujuan Pembelajaran (TP)</h2>
          <button onClick={handlePrintTP} className="text-sm px-3 py-1 flex items-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700">
            <Printer className="w-4 h-4 mr-1" /> Cetak
          </button>
        </div>
        
        <div id="tp-print-area" className="space-y-6">
          <p className="text-gray-600">Berdasarkan analisis AI, berhasil diidentifikasi <strong>{rppData.tujuanPembelajaran.length} materi pokok</strong> dengan rincian sebagai berikut:</p>
          
          {rppData.tujuanPembelajaran.map((group, idx) => (
            <div key={idx} className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 border-b">
                <h4 className="font-semibold text-blue-900">Materi Pokok: {group.topic}</h4>
              </div>
              <ul className="divide-y divide-gray-100">
                {group.tps.map((tp: any, tIdx: number) => (
                  <li key={tIdx} className="flex p-3 hover:bg-gray-50">
                    <span className="w-32 flex-shrink-0 font-medium text-sm text-gray-500">{tp.level}</span>
                    <span className="text-gray-800">{tp.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-0 h-[2px] bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-full" />

      {/* ATP Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-pink-700">Alur Tujuan Pembelajaran (ATP)</h2>
          <button onClick={handlePrintATP} className="text-sm px-3 py-1 flex items-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700">
            <Printer className="w-4 h-4 mr-1" /> Cetak
          </button>
        </div>

        <div id="atp-print-area" className="space-y-6">
          <p className="text-gray-600">Tujuan pembelajaran diurutkan berdasarkan materi pokok untuk membentuk Alur Pembelajaran yang logis.</p>
          
          {rppData.tujuanPembelajaran.map((group, idx) => (
            <div key={idx} className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h4 className="font-semibold text-gray-800">ATP untuk: {group.topic}</h4>
              </div>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-100/50">
                    <th className="w-16 p-2 text-center border-r font-medium">Urutan</th>
                    <th className="p-2 font-medium">Tujuan Pembelajaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {group.tps.map((tp: any, tIdx: number) => (
                    <tr key={tIdx}>
                      <td className="p-2 text-center border-r text-gray-500">{tIdx + 1}</td>
                      <td className="p-2">{tp.text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-0 h-[2px] bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

      <div className="flex justify-between pt-4">
        <button onClick={() => setStep(3)} className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50">
          <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
        </button>
        <button onClick={() => setStep(5)} className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Lanjut ke KKTP <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
