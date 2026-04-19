-- 1. Buat Tabel admin_settings
CREATE TABLE public.admin_settings (
    id bigint PRIMARY KEY,
    api_keys jsonb,
    marquee_text text,
    default_sekolah text,
    default_kepsek text,
    default_guru text,
    default_mapel text,
    default_kota text
);

-- 2. Masukkan data default awal (Wajib untuk ID = 1)
INSERT INTO public.admin_settings (
    id, 
    api_keys, 
    marquee_text, 
    default_sekolah, 
    default_kepsek, 
    default_guru, 
    default_mapel, 
    default_kota
) VALUES (
    1,
    '["", "", "", "", "", "", "", "", "", ""]'::jsonb,
    'SIGMA | SDN BAUJENG I BEJI',
    'SDN BAUJENG I BEJI',
    'AKHMAD NASOR / 198704082019031001',
    'SULFIA IRANA, S.Pd',
    'IPAS',
    'Beji'
);

-- 3. Mengatur Keamanan (Row Level Security) agar bisa diakses dari aplikasi
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Izinkan aplikasi untuk MEMBACA (SELECT) data
CREATE POLICY "Allow public select" 
ON public.admin_settings 
FOR SELECT USING (true);

-- Izinkan aplikasi untuk MENAMBAH (INSERT) data via Admin Panel
CREATE POLICY "Allow public insert" 
ON public.admin_settings 
FOR INSERT WITH CHECK (true);

-- Izinkan aplikasi untuk MENGUBAH (UPDATE) data via Admin Panel
CREATE POLICY "Allow public update" 
ON public.admin_settings 
FOR UPDATE USING (true) WITH CHECK (true);
