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

### Fase 3: Integrasi CMS & Output Streaming ✅
- **Sistem Penjadwalan**: Input judul stream, hari, dan jam
- **Generator Gambar (PNG)**: Export ke PNG 1920x1080 untuk media sosial
- **Browser Source URL**: Clean link untuk OBS/Streamlabs

### Fase 4: Pengujian & Peluncuran 🚧
- Halaman Community Hub untuk menampilkan jadwal gabungan
- Siap untuk closed beta testing

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Export**: html2canvas untuk PNG generation
- **State Management**: React Context API
- **Storage**: LocalStorage (demo) / Backend API (production)

## 🚀 Quick Start

```bash
# Install dependencies
cd vtuber-schedule-platform
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Struktur Project

```
vtuber-schedule-platform/
├── src/
│   ├── components/       # Reusable components
│   ├── context/          # React Context (Auth, Template)
│   ├── pages/            # Page components
│   │   ├── LoginPage.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── TemplateEditor.jsx
│   │   └── CommunityHub.jsx
│   ├── services/         # API & utility services
│   │   └── exportService.js
│   ├── utils/            # Helper functions
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
| `/admin/dashboard` | Admin | Admin dashboard |
| `/stream/:userId/:templateId` | Public | Clean view untuk OBS Browser Source |

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
