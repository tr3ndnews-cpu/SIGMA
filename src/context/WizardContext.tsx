import { createContext, useContext, useState, ReactNode } from 'react';

export interface RPPData {
  // Step 1
  namaSekolah: string;
  jenjang: string;
  mapel: string;
  tahunPelajaran: string;
  kelasSemester: string;
  fase: string;
  alokasiWaktu: string;
  namaGuru: string;
  namaKepsek: string;
  kota: string;
  
  // Step 2
  kktpTercapaiMin: number;
  profilLulusan: string[];
  saranaPrasarana: string;
  identifikasi: {
    karakteristik: string;
    minat: string;
    motivasi: string;
    prestasi: string;
    lingkungan: string;
  };
  kerangka: {
    kemitraan: string;
    lingkunganPemb: string;
    digitalPerencanaan: string;
    digitalPelaksanaan: string;
    digitalAsesmen: string;
  };
  
  // Step 3
  cpMateri: string;
  
  // Generated
  tujuanPembelajaran: any[];
}

interface WizardContextType {
  step: number;
  setStep: (step: number) => void;
  rppData: RPPData;
  updateRppData: (data: Partial<RPPData>) => void;
}

const defaultRppData: RPPData = {
  namaSekolah: '',
  jenjang: 'SD',
  mapel: 'IPAS',
  tahunPelajaran: '',
  kelasSemester: '',
  fase: '',
  alokasiWaktu: '',
  namaGuru: '',
  namaKepsek: '',
  kota: 'Beji',
  kktpTercapaiMin: 80,
  profilLulusan: [],
  saranaPrasarana: 'LCD Projector, Papan Tulis, Spidol',
  identifikasi: {
    karakteristik: 'Sebagian siswa cenderung pasif, 2 siswa berkebutuhan khusus, ada yang belum lancar membaca/berhitung.',
    minat: 'Sebagian siswa minat belajar rendah, lebih suka praktik di laboratorium dan kerja kelompok.',
    motivasi: 'Sebagian siswa motivasi belajar rendah.',
    prestasi: 'Rata-rata prestasi belajar menurun.',
    lingkungan: ''
  },
  kerangka: {
    kemitraan: 'Guru Mapel, Pemerhati lingkungan hidup',
    lingkunganPemb: 'Budaya tertib, bersih, disiplin (5K), Adi Wiyata',
    digitalPerencanaan: 'Pemanfaatan AI, Canva.',
    digitalPelaksanaan: 'Pemanfaatan AI, Canva.',
    digitalAsesmen: 'Pemanfaatan Quizziz, Canva.'
  },
  cpMateri: '',
  tujuanPembelajaran: []
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [rppData, setRppData] = useState<RPPData>(defaultRppData);

  const updateRppData = (data: Partial<RPPData>) => {
    setRppData(prev => ({ ...prev, ...data }));
  };

  return (
    <WizardContext.Provider value={{ step, setStep, rppData, updateRppData }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) throw new Error('useWizard must be used within WizardProvider');
  return context;
}
