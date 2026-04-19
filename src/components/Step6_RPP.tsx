import { useState, useEffect } from 'react';
import { useWizard } from '../context/WizardContext';
import { useSettings } from '../context/SettingsContext';
import { ChevronLeft, Printer, Loader2, Play } from 'lucide-react';
import { generateContentWithFailover } from '../lib/gemini';

export function Step6RPP() {
  const { rppData, setStep } = useWizard();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [soalHtmls, setSoalHtmls] = useState<Record<number, string>>({});
  const [error, setError] = useState('');

  const generateSoalForTp = async (tp: any, index: number) => {
    const prompt = `Anda adalah seorang ahli pembuat soal ujian untuk level ${rppData.jenjang}. Buat instrumen penilaian HOTS untuk RPP mata pelajaran ${rppData.mapel} dengan tujuan pembelajaran: "${tp.text}".
                    
Buat respons dalam format JSON yang valid. JSON harus memiliki dua kunci utama: "pilihan_ganda" dan "uraian".

"pilihan_ganda" berisi array 5 objek soal. Tiap objek: "pertanyaan" (string), "opsi" (objek dgn kunci "A", "B", "C", "D", "E"), dan "kunci" (string misal "A").
"uraian" berisi array 2 objek soal. Tiap objek: "pertanyaan" (string) dan "pembahasan" (string).`;

    const schema = {
      type: "OBJECT",
      properties: {
        "pilihan_ganda": {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              "pertanyaan": { "type": "STRING" },
              "opsi": {
                type: "OBJECT",
                properties: { "A": {"type":"STRING"}, "B": {"type":"STRING"}, "C": {"type":"STRING"}, "D": {"type":"STRING"}, "E": {"type":"STRING"} },
                required: ["A", "B", "C", "D", "E"]
              },
              "kunci": { "type": "STRING" }
            },
            required: ["pertanyaan", "opsi", "kunci"]
          }
        },
        "uraian": {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: { "pertanyaan": { "type": "STRING" }, "pembahasan": { "type": "STRING" } },
            required: ["pertanyaan", "pembahasan"]
          }
        }
      },
      required: ["pilihan_ganda", "uraian"]
    };

    const apiKeys = settings.apiKeys.filter(k => k.trim());
    const res = await generateContentWithFailover(prompt, apiKeys, schema);

    let pgHtml = '';
    res.pilihan_ganda.forEach((soal: any, i: number) => {
      pgHtml += `<li class="mt-4">${soal.pertanyaan}<ol type="A" class="ml-8 list-none p-0"><li>A. ${soal.opsi.A}</li><li>B. ${soal.opsi.B}</li><li>C. ${soal.opsi.C}</li><li>D. ${soal.opsi.D}</li><li>E. ${soal.opsi.E}</li></ol></li>`;
    });
    const kunci = res.pilihan_ganda.map((s:any, i:number) => `${i+1}. ${s.kunci}`).join('<br>');

    let urHtml = '';
    res.uraian.forEach((soal: any) => {
      urHtml += `<li class="mt-4"><strong>${soal.pertanyaan}</strong><p class="mt-2"><strong>Pembahasan:</strong> ${soal.pembahasan}</p></li>`;
    });

    return `<div class="lampiran-section mt-8" style="page-break-before: always;">
      <h3 class="font-bold text-xl mb-4">LAMPIRAN: INSTRUMEN PENILAIAN</h3>
      <h4 class="font-semibold text-lg">I. Soal Pilihan Ganda</h4>
      <ol class="list-decimal list-inside space-y-3 mb-4">${pgHtml}</ol>
      <h5 class="font-bold mt-4">Kunci Jawaban PG</h5><div class="mb-4">${kunci}</div>
      <h4 class="font-semibold text-lg mt-6">II. Soal Uraian</h4>
      <ol class="list-decimal list-inside space-y-4">${urHtml}</ol>
    </div>`;
  };

  const handleGenerateAllSoal = async () => {
    setLoading(true);
    setError('');
    let flatTps = rppData.tujuanPembelajaran.flatMap(g => g.tps);
    let newSoals: Record<number, string> = {};
    
    try {
      for (let i = 0; i < flatTps.length; i++) {
        const tp = flatTps[i];
        if (!soalHtmls[i]) {
          newSoals[i] = await generateSoalForTp(tp, i);
        } else {
          newSoals[i] = soalHtmls[i];
        }
      }
      setSoalHtmls(newSoals);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const parseName = (s:string) => s.includes('/') ? s.split('/')[0].trim() : s.trim();
    const fileName = `RPP ${rppData.mapel} ${rppData.kelasSemester.replace(/\s\/\s/g, '-')} Fase ${rppData.fase} ${parseName(rppData.namaGuru)}`;

    const el = document.getElementById('full-rpp-content');
    if (!el) return;

    const pw = window.open('', '_blank');
    if (!pw) return;

    pw.document.open();
    pw.document.write(`
      <html><head><title>${fileName}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @page { size: A4; margin: 2cm; }
        body { font-family: 'Inter', system-ui, sans-serif; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
        th, td { border: 1px solid #e5e7eb; padding: 0.5rem; text-align: left; vertical-align: top;}
        .rpp-section { page-break-after: always; }
        .rpp-section:last-child { page-break-after: auto; }
        .rpp-footer { display: block; text-align: left; margin-top: 1.25cm; font-style: italic; color: #6b7280; font-size: 9pt; }
      </style>
      </head><body>${el.innerHTML}</body></html>
    `);
    pw.document.close();
    setTimeout(() => { pw.focus(); pw.print(); pw.close(); }, 500);
  };

  const parseNameAndNip = (s: string) => s.includes('/') ? { name: s.split('/')[0].trim(), nip: s.split('/')[1].trim() } : { name: s.trim(), nip: '' };
  const guru = parseNameAndNip(rppData.namaGuru);
  const kepsek = parseNameAndNip(rppData.namaKepsek);
  const fDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  let rppCounter = 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-t-4 border-t-green-500 p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-700">Hasil RPP Lengkap</h2>
        <div className="space-x-2">
          <button onClick={handleGenerateAllSoal} disabled={loading} className="text-sm px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded inline-flex items-center">
            {loading ? (
              <div className="w-5 h-5 relative mr-2">
                <div className="loader absolute-center" style={{ transform: 'scale(0.3) rotate(165deg)', top: '10px', left: '10px' }}></div>
              </div>
            ) : <Play className="w-4 h-4 mr-2" />}
            Generate Lampiran Soal AI
          </button>
          <button onClick={handlePrint} className="text-sm px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded inline-flex items-center">
            <Printer className="w-4 h-4 mr-2" /> Cetak RPP
          </button>
        </div>
      </div>
      
      {error && <div className="p-3 bg-red-50 text-red-600 rounded mb-4">{error}</div>}

      <div className="border p-8 overflow-y-auto max-h-[70vh] bg-gray-50 shadow-inner rounded-md" id="full-rpp-content">
        <div className="mb-4 p-4 border rounded-md bg-white rpp-section">
          <h3 className="font-bold text-xl mb-2">Identifikasi Awal Peserta Didik</h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Karakteristik Siswa:</strong> {rppData.identifikasi.karakteristik}</li>
            <li><strong>Minat Belajar:</strong> {rppData.identifikasi.minat}</li>
            <li><strong>Motivasi Belajar:</strong> {rppData.identifikasi.motivasi}</li>
            <li><strong>Prestasi Belajar:</strong> {rppData.identifikasi.prestasi}</li>
            <li><strong>Lingkungan Sekolah:</strong> {rppData.identifikasi.lingkungan}</li>
          </ul>
        </div>

        {rppData.tujuanPembelajaran.map((group) => {
          return group.tps.map((tp: any, index: number) => {
            rppCounter++;
            const isPBL = tp.level === 'Memahami'; 
            const model = isPBL ? 'Problem Based Learning (PBL)' : 'Project Based Learning (PjBL)';
            const soalHtml = soalHtmls[rppCounter - 1] || '<div class="text-gray-400 italic my-4 border p-4 bg-gray-50 text-center">Lampiran soal belum digenerate. Klik "Generate Lampiran Soal AI" di atas.</div>';

            return (
              <div key={rppCounter} className="rpp-section mt-8 bg-white p-8 border">
                <h2 className="text-center font-bold text-2xl mb-1">RENCANA PELAKSANAAN PEMBELAJARAN (RPP)</h2>
                <h3 className="text-center font-bold text-xl mb-4">PERTEMUAN KE-{rppCounter}</h3>
                
                <h4 className="font-bold text-lg mt-8 mb-2">A. IDENTITAS MODUL</h4>
                <table className="my-2 border-none">
                  <tbody>
                    <tr><td className="font-semibold w-1/3">Nama Penyusun</td><td>: {rppData.namaGuru}</td></tr>
                    <tr><td className="font-semibold">Satuan Pendidikan</td><td>: {rppData.namaSekolah}</td></tr>
                    <tr><td className="font-semibold">Mata Pelajaran</td><td>: {rppData.mapel}</td></tr>
                    <tr><td className="font-semibold">Kelas/Fase</td><td>: {rppData.kelasSemester} / Fase {rppData.fase}</td></tr>
                    <tr><td className="font-semibold">Materi Pokok</td><td>: {group.topic}</td></tr>
                    <tr><td className="font-semibold">Alokasi Waktu</td><td>: {rppData.alokasiWaktu}</td></tr>
                    <tr><td className="font-semibold">Model Pembelajaran</td><td>: {model}</td></tr>
                    {rppData.profilLulusan.length > 0 && <tr><td className="font-semibold">Profil Lulusan</td><td>: {rppData.profilLulusan.join(', ')}</td></tr>}
                    {rppData.saranaPrasarana && <tr><td className="font-semibold">Sarana & Prasarana</td><td>: {rppData.saranaPrasarana}</td></tr>}
                  </tbody>
                </table>

                <h4 className="font-bold text-lg mt-4 mb-2">B. TUJUAN PEMBELAJARAN</h4>
                <p className="p-2 bg-gray-100 rounded mb-4">{tp.text}</p>
                
                <h4 className="font-bold text-lg mt-4 mb-2">C. KERANGKA PEMBELAJARAN</h4>
                <ol className="list-decimal list-inside space-y-2 mb-4">
                  <li><strong>Kemitraan Pembelajaran:</strong> {rppData.kerangka.kemitraan}</li>
                  <li><strong>Lingkungan Pembelajaran:</strong> {rppData.kerangka.lingkunganPemb}</li>
                  <li><strong>Pemanfaatan Digital (Perencanaan):</strong> {rppData.kerangka.digitalPerencanaan}</li>
                </ol>

                <h4 className="font-bold text-lg mt-4 mb-2">D. LANGKAH PEMBELAJARAN</h4>
                <div className="border-l-4 border-blue-500 pl-4 py-2 mb-2">
                  <p className="font-semibold">Kegiatan Pendahuluan</p>
                  <ul className="list-disc ml-4">
                    <li>Apersepsi: Guru memulai dengan salam, doa, dan memeriksa kehadiran. (Mindful Learning)</li>
                    <li>Motivasi: Guru menampilkan media relevan terkait <b>{group.topic}</b>. (Meaningful Learning)</li>
                  </ul>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2 mb-4">
                  <p className="font-semibold">Kegiatan Inti ({model})</p>
                  <ol className="list-decimal ml-4">
                    {isPBL ? (
                      <>
                        <li>Orientasi siswa pada masalah terkait {group.topic}.</li>
                        <li>Mengorganisasikan siswa untuk belajar dan menyelidiki.</li>
                        <li>Bimbingan penyelidikan secara berkelompok.</li>
                        <li>Pengembangan dan penyajian hasil penyelidikan.</li>
                      </>
                    ) : (
                      <>
                        <li>Penentuan Proyek mendasar terkait {group.topic}.</li>
                        <li>Mendesain perencanaan proyek secara kolaboratif.</li>
                        <li>Menyusun jadwal kegiatan proyek.</li>
                        <li>Memonitor perkembangan pelaksanaan proyek siswa.</li>
                      </>
                    )}
                  </ol>
                </div>

                <div className="mt-12" style={{ pageBreakInside: 'avoid' }}>
                  <div className="flex justify-end"><div className="text-center">{rppData.kota}, {fDate}</div></div>
                  <div className="flex justify-between mt-4 text-center">
                    <div className="w-2/5">
                      <p>Mengetahui,</p><p>Kepala Sekolah</p><div className="h-20"></div>
                      <p className="font-bold underline">{kepsek.name}</p><p>{kepsek.nip ? `NIP: ${kepsek.nip}` : 'NIP: .....................'}</p>
                    </div>
                    <div className="w-2/5">
                      <p className="text-white">.</p><p>Guru Mata Pelajaran</p><div className="h-20"></div>
                      <p className="font-bold underline">{guru.name}</p><p>{guru.nip ? `NIP: ${guru.nip}` : 'NIP: .....................'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="rpp-footer">RPP {guru.name} {rppData.mapel} {rppData.tahunPelajaran} {rppData.kelasSemester} {rppData.namaSekolah}</div>
                
                <div dangerouslySetInnerHTML={{ __html: soalHtml }} />
              </div>
            );
          });
        })}
      </div>

      <div className="pt-4 border-t">
        <button onClick={() => setStep(5)} className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50">
          <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke KKTP
        </button>
      </div>
    </div>
  );
}
