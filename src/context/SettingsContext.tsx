import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export interface AdminSettings {
  apiKeys: string[];
  marqueeText: string;
  defaultSekolah: string;
  defaultKepsek: string;
  defaultGuru: string;
  defaultMapel: string;
  defaultKota: string;
  supabaseUrl: string;
  supabaseKey: string;
}

const defaultSettings: AdminSettings = {
  apiKeys: Array(10).fill(''),
  marqueeText: 'SIGMA | SDN BAUJENG I BEJI',
  defaultSekolah: 'SDN BAUJENG I BEJI',
  defaultKepsek: 'AKHMAD NASOR / 198704082019031001',
  defaultGuru: 'SULFIA IRANA, S.Pd',
  defaultMapel: 'IPAS',
  defaultKota: 'Beji',
  supabaseUrl: 'https://dyrlsbevrjxdwplvzccr.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cmxzYmV2cmp4ZHdwbHZ6Y2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDc4NDMsImV4cCI6MjA5MjE4Mzg0M30.imTYUaYpd6pKgdHYwpxjW8JXlrtNW60VVQJpVxB9dzs'
};

interface SettingsContextType {
  settings: AdminSettings;
  updateSettings: (newSettings: AdminSettings) => void;
  isAdminMode: boolean;
  setAdminMode: (mode: boolean) => void;
  isSaving: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('rppAdminSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [isAdminMode, setAdminMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem('rppAdminSettings', JSON.stringify(settings));
  }, [settings]);

  // Load from Supabase on mount if URL & Key exist
  useEffect(() => {
    const loadFromSupabase = async () => {
      if (settings.supabaseUrl && settings.supabaseKey) {
        try {
          const supabase = createClient(settings.supabaseUrl, settings.supabaseKey);
          const { data, error } = await supabase
            .from('admin_settings')
            .select('*')
            .eq('id', 1)
            .single();

          if (data && !error) {
            setSettings(prev => ({
              ...prev,
              apiKeys: data.api_keys || prev.apiKeys,
              marqueeText: data.marquee_text || prev.marqueeText,
              defaultSekolah: data.default_sekolah || prev.defaultSekolah,
              defaultKepsek: data.default_kepsek || prev.defaultKepsek,
              defaultGuru: data.default_guru || prev.defaultGuru,
              defaultMapel: data.default_mapel || prev.defaultMapel,
              defaultKota: data.default_kota || prev.defaultKota,
            }));
          }
        } catch (err) {
          console.error("Failed to load settings from Supabase", err);
        }
      }
    };
    loadFromSupabase();
  }, [settings.supabaseUrl, settings.supabaseKey]);

  const updateSettings = async (newSettings: AdminSettings) => {
    setSettings(newSettings);
    
    // Attempt to sync to Supabase if configured
    if (newSettings.supabaseUrl && newSettings.supabaseKey) {
      setIsSaving(true);
      try {
        const supabase = createClient(newSettings.supabaseUrl, newSettings.supabaseKey);
        await supabase
          .from('admin_settings')
          .upsert({ 
            id: 1, 
            api_keys: newSettings.apiKeys,
            marquee_text: newSettings.marqueeText,
            default_sekolah: newSettings.defaultSekolah,
            default_kepsek: newSettings.defaultKepsek,
            default_guru: newSettings.defaultGuru,
            default_mapel: newSettings.defaultMapel,
            default_kota: newSettings.defaultKota
          });
      } catch (err) {
        console.error("Failed to save to Supabase", err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isAdminMode, setAdminMode, isSaving }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
