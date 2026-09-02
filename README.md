# 🎉 Zalfa's Special Birthday Website 🎂✨

Sebuah website kejutan ulang tahun interaktif, estetik, dan penuh makna yang dibuat khusus oleh **Raditya Rai Zeeshan** untuk merayakan hari spesial **Zalfa Ramadani**.

---

## 🌟 Fitur Utama & Alur Pengalaman

Website ini dirancang layaknya sebuah perjalanan interaktif (*emotional storytelling*) dari awal hingga akhir:

### 1. 🔒 Layar Masuk Rahasia (Passcode Screen)
- Dilengkapi dengan *dreamy ambient backlight slideshow* 6 foto Zalfa yang berganti secara halus.
- Memerlukan **6-digit Passcode PIN** (`050909`) yang merupakan tanggal lahir Zalfa untuk membuka kejutan.
- Keypad numerik interaktif dengan efek getar (*shake*) jika kode salah.

### 2. 🎁 Kotak Hadiah & Surat Ucapan (Typewriter Letter)
- Kotak kado 3D interaktif yang mengeluarkan ledakan *sparkles* dan memunculkan frame foto spesial saat diketuk.
- Surat ucapan ulang tahun panjang yang diketik otomatis menggunakan animasi *typewriter* (dapat diklik untuk mempercepat/langsung menampilkan semua teks).

### 3. 🎧 Audio Playlist Cerdas (Seamless Crossfade & Fade-In)
- **Mulai Otomatis Saat Kado Dibuka:** Musik pertama baru berputar begitu kotak kado diketuk, menyuguhkan momen magis.
- **Track 1:** *Nadin Amizah — Semua Aku Dirayakan* (dengan efek *smooth fade-in* 4 detik).
- **Track 2:** *Backstreet Boys — Shape of My Heart* (secara otomatis melakukan *fade-out* halus di akhir lagu pertama lalu *fade-in* ke lagu kedua dan berputar secara *loop*).
- **Floating Glassmorphic Controller:** Tombol kontrol musik di pojok kanan atas dengan rotasi kaset/piringan hitam, sinkronisasi *MediaSession API*, serta *auto-pause* saat berpindah tab/aplikasi.

### 4. 🎂 Make a Wish & Tiup Lilin Interaktif
- Visual kue ulang tahun dengan lilin menyala yang memiliki animasi api berpendar.
- Zalfa dapat berdoa dalam hati lalu mengetuk tombol untuk **meniup lilin**, memicu ledakan konfeti perayaan multi-tahap (*festive confetti cannon*).

### 5. 📻 Cerita di Balik Lagu (Mixtape Cassette Interaktif)
- Kartu visual kaset vintage dengan **dua roda gir yang berputar halus** dan bar gelombang suara audio (*equalizer*).
- Dilengkapi fitur *tab switcher* responsif:
  - **🌸 Side A:** Cerita dan makna mendalam di balik pemilihan lagu *“Semua Aku Dirayakan”*.
  - **💫 Side B:** Pesan tulus dan doa di balik pemilihan lagu *“Shape of My Heart”*.

### 6. 🎞️ Photostrip Photobooth Interaktif (Life 3 Cuts / Mall Edition)
- Format photostrip vertikal ala mesin photobooth mall/Korea (Life 4 Cuts / Haru Film) yang membagi 6 foto menjadi **2 Strip eksklusif** (Strip #1: *Sweet Vibes* & Strip #2: *Memorable Cut*).
- **Custom Frame Color:** Zalfa bisa mengganti warna kertas strip secara dinamis (*Lilac Pastel*, *Classic White*, *Sakura Pink*, *Retro Noir*, atau *Warm Cream*).
- **View Switcher:** Pilihan tampilan *Duo Strip* (berdampingan) atau fokus ke masing-masing strip.
- **Interaksi & Caption:** Dilengkapi barcode autentik, nomor cut film, stiker washi tape, tombol like/love, serta modal *zoom preview* lengkap dengan pesan cerita manis.
- **📥 Download ke Galeri HP (HD PNG):** Didukung mesin **HTML5 Canvas** untuk mengunduh photostrip langsung sebagai gambar jernih beresolusi tinggi siap diunggah ke Instagram Story.

### 7. 🏆 Exclusive Recognition Award (3-in-1 Theme Switcher)
- Transformasi dari sertifikat kaku menjadi 3 format dokumen penghargaan yang super gemes & kekinian:
  - 🪪 **KTP Semesta (VIP Resident ID):** Kartu identitas penduduk semesta dengan chip emas mikrochip, NIK `0509-2009-2026`, status *Level Up (+1 Tahun)*, dan stempel hologram *Verified Cute*.
  - 🎫 **VIP Boarding Pass:** Tiket penerbangan first-class *Zalfa Airways* rute *Umur Kemarin* ✈️ *Babak Baru Paling Bahagia*, nomor kursi `05A`, garis perforasi sobekan, dan stempel stempel retro *Boarded*.
  - 🧾 **Aesthetic Receipt (Struk Kasir Semesta):** Struk cafe vintage dengan rincian "transaksi kebaikan" (sehat, bahagia, bebas overthinking), total tagihan Rp 0 (*Lunas Ditanggung Semesta*), dan barcode.
- **📥 Download HD PNG untuk Ketiga Tema:** Setiap tema dapat langsung diunduh ke galeri HP dengan resolusi tinggi HD Canvas yang tajam dan presisi.

### 8. 🏮 Terbangkan Lampion Harapan & Direct WhatsApp
- Kolom khusus bagi Zalfa untuk menuliskan impian dan doanya.
- Tombol untuk menerbangkan lampion bercahaya ke langit malam diiringi kembang api spektakuler.
- Tombol cepat untuk langsung mengirim pesan terima kasih dan isi harapan ke WhatsApp Raditya.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) dengan Glassmorphism & Custom Keyframe Animations
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Confetti Engine:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 📁 Struktur Komponen Utama

```text
app/
├── components/
│   ├── BackgroundMusic.tsx      # Lifecycle audio manager, crossfade, dan floating toggle
│   ├── BirthdayCertificate.tsx  # Canvas HD certificate generator & download engine
│   ├── CandleSection.tsx        # Interaksi kue, lilin tiup, & confetti burst
│   ├── FloatingParticles.tsx    # Partikel melayang estetik di background
│   ├── GiftBoxSection.tsx       # Kotak kado, surat typewriter, dan wrapper konten
│   ├── GrandFinaleOutro.tsx     # Lampion terbang, kembang api, & integrasi WhatsApp
│   ├── PasscodeFlow.tsx         # Manajemen step (Layar PIN, Pop-up, & Kado)
│   ├── PhotoGallery.tsx         # Polaroid photo gallery dengan modal preview
│   └── SongMeaningSection.tsx   # Kaset interaktif Side A/B & makna lagu
├── layout.tsx                   # Metadata, font Geist, dan root layout
└── page.tsx                     # Entry point utama halaman
public/
├── audio/                       # File lagu (Nadin Amizah & Shape of My Heart)
└── photos/                      # Foto-foto kenangan Zalfa
```

---

## 🚀 Menjalankan Project di Lokal

1. **Clone repository & masuk ke folder project:**
   ```bash
   git clone https://github.com/zshnrdtya/you-birthday.git
   cd you-birthday
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Jalankan local development server:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

4. **Build untuk production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 💌 Dedication

> *Dibuat dengan segenap ketulusan dan usaha terbaik untuk merayakan kehadiran seseorang yang sangat berarti di dunia ini.*  
> **Happy Birthday, Zalfa Ramadani! 🤍🎂**
