# 🎬 VTuber Schedule Platform

Platform web untuk membuat dan mengelola jadwal streaming VTuber dengan template yang dapat dikustomisasi.

## 📋 Fitur Utama

### Fase 1: Fondasi Multi-Pengguna & Manajemen Data ✅
- **Sistem Autentikasi**: Login terpisah untuk Super Admin dan User (VTuber)
- **Logika Kloning Data**: Template dari galeri diduplikasi ke workspace pribadi user
- **Ruang Penyimpanan Mandiri**: Setiap user memiliki workspace terisolasi

### Fase 2: Mesin Template & Editor Visual ✅
- **Manajemen Master Template (Admin)**: Interface untuk admin mengelola template
- **Editor Kustomisasi Real-Time**: Drag-and-drop untuk mengubah warna, font, posisi karakter
- **Parameter Batasan Modifikasi**: JSON structure untuk mengunci elemen vital (aspect ratio 16:9)

### Fase 3: Integrasi CMS & Output Streaming 🚧
- **Sistem Penjadwalan**: Input judul stream, hari, dan jam ✅
- **Generator Gambar (PNG)**: Export ke PNG 1920x1080 untuk media sosial ✅
- **Browser Source URL**: Generator URL untuk OBS ✅ — *halaman tujuannya (`/stream/:userId/:templateId`) masih placeholder, belum merender jadwal sungguhan*

### Fase 4: Pengujian & Peluncuran 🚧
- Halaman Community Hub untuk menampilkan jadwal gabungan ✅ (masih memakai mock data)
- Siap untuk closed beta testing

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite 8
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Export**: html2canvas untuk PNG generation
- **State Management**: React Context API
- **Testing**: Vitest + Testing Library (jsdom)
- **Linting**: Oxlint
- **Storage**: LocalStorage (demo) / Backend API (production)

## 🚀 Quick Start

```bash
# Install dependencies
cd vtuber-schedule-platform
npm install

# Run development server
npm run dev

# Jalankan test
npm test

# Lint
npm run lint

# Build for production
npm run build
```

## 🌐 Deploy ke Netlify

Aplikasi berada di subfolder `vtuber-schedule-platform/`, bukan di root repo.
`netlify.toml` di root sudah menyetel `base = "vtuber-schedule-platform"`, jadi
**Base directory di dashboard Netlify boleh dibiarkan kosong** — build akan tetap jalan.

```bash
# Hubungkan repo ke Netlify, lalu biarkan Netlify mendeteksi netlify.toml di root.
# Build command : npm run build
# Publish dir   : vtuber-schedule-platform/dist
```

> ⚠️ `vite.config.js` harus memakai `base: '/'` (absolut). Dengan `base: './'`,
> asset di-resolve relatif terhadap URL dokumen sehingga route bertingkat seperti
> `/user/dashboard` atau `/editor/:id` menampilkan halaman putih saat deploy.

## 📁 Struktur Project

```
vtuber-schedule-platform/
├── src/
│   ├── __tests__/        # Vitest: editor, context, kanvas, penjaga cakupan CSS
│   ├── components/       # Komponen reusable
│   │   ├── ScheduleCanvas.jsx   # Kanvas 1920x1080 (editor, preview, OBS)
│   │   └── Toast.jsx            # Pengganti window.alert()
│   ├── context/          # Context object + Provider
│   │   ├── AuthContext.js / AuthProvider.jsx
│   │   └── TemplateContext.js / TemplateProvider.jsx
│   ├── hooks/            # useAuth, useTemplate, useToast
│   ├── pages/            # Page components
│   │   ├── LoginPage.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── TemplateEditor.jsx
│   │   ├── PreviewPage.jsx
│   │   ├── StreamPage.jsx       # tujuan Browser Source OBS
│   │   └── CommunityHub.jsx
│   ├── services/         # exportService.js (PNG + URL Browser Source)
│   ├── utils/            # id, format, storage, canvasDefaults
│   ├── App.jsx           # Main app with routing
│   └── index.css         # Global styles
└── public/               # Static assets
```

## 👥 Cara Penggunaan

### Untuk VTuber (User):
1. Login dengan memilih role "VTuber (User)"
2. Pilih template dari Galeri Template
3. Template akan dikloning ke Workspace Anda
4. Edit template: ubah warna, font, posisi karakter
5. Tambahkan jadwal stream
6. Export sebagai PNG atau dapatkan Browser Source URL untuk OBS

### Untuk Admin:
1. Login dengan memilih role "Super Admin"
2. Kelola Master Templates di galeri
3. Upload template baru dengan konfigurasi locked elements
4. Monitor analytics platform

## 🔐 Authentication Flow

```
Login Page → Role Selection → Dashboard (User/Admin) → Editor → Export
```

## 🎨 Template System

Setiap template memiliki:
- **Locked Elements**: Aspect ratio, resolution (tidak bisa diubah user)
- **Customizable Elements**: Colors, fonts, character position (bisa diubah)

## 📤 Export Options

1. **PNG Export**: Download gambar 1920x1080 untuk Twitter/YouTube Community
2. **Browser Source**: URL untuk OBS yang auto-update saat jadwal berubah

## 🌐 Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Redirect ke Community Hub |
| `/login` | Public | Halaman login |
| `/community` | Public | Community Hub (live streams & jadwal) |
| `/user/dashboard` | User | Dashboard VTuber |
| `/editor/:templateId` | User | Template editor |
| `/preview/:templateId` | User | Pratinjau ukuran penuh 1920×1080 + export PNG |
| `/admin/dashboard` | Admin | Admin dashboard (tambah/hapus master template) |
| `/stream/:userId/:templateId` | Public | Halaman tujuan Browser Source OBS |

## ⚠️ Keterbatasan Saat Ini

Hal-hal berikut masih bersifat demo dan **belum aman untuk production**:

- **Autentikasi mock** — `login()` menerima email + password apa pun, dan role
  `admin` bisa dipilih bebas di halaman login. Tidak ada verifikasi kredensial.
- **Semua data di localStorage** — template, jadwal, dan sesi hanya tersimpan di
  browser pengguna; tidak ada backend.
- **Halaman `/stream/...` membaca localStorage** — URL Browser Source bisa
  dibuat dan halamannya sudah merender jadwal, tapi datanya berasal dari
  localStorage browser yang sama. OBS memakai profil CEF terpisah dengan
  localStorage sendiri, jadi URL itu belum bisa dipakai langsung dari OBS
  sampai ada backend API.
- **Master template admin** — tambah/hapus sudah berfungsi dan bertahan setelah
  reload, tapi hanya tersimpan di browser admin tersebut. Tombol *Edit* masih
  dinonaktifkan karena butuh backend.

## 🔮 Future Enhancements

- [ ] Backend API integration (Node.js/Express + PostgreSQL)
- [ ] Cloud storage untuk asset gambar (AWS S3/Cloudinary)
- [ ] Real-time collaboration features
- [ ] More template categories
- [ ] Timezone conversion yang lebih akurat
- [ ] Analytics dashboard yang lebih detail
- [ ] Mobile responsive optimization

## 📝 License

MIT License - dibuat untuk komunitas VTuber Indonesia 💜

---

**Dibuat dengan ❤️ untuk Sora Wirya dan teman-teman VTuber**
