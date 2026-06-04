/**
 * Konfigurasi terpusat untuk teks panduan (PageGuide) di seluruh halaman aplikasi Kainest.
 * Setiap key merepresentasikan nama halaman/modul.
 */
export const pageGuides = {
  dashboard: [
    {
      emoji: "🎒",
      title: "1. Atur Kantongmu",
      desc: "Sebelum mencatat, buat kategori kantong untuk membagi-bagi gajimu, baik secara nominal (Rp) maupun persentase di menu <strong>Kelola Kantong</strong>."
    },
    {
      emoji: "📲",
      title: "2. Setup WaBot (Personal)",
      desc: "Mulai pencatatan otomatis via WhatsApp! Buka <strong>Profil (kanan atas)</strong> ➡️ <strong>Settings</strong> ➡️ <strong>Tautkan ke Bot WhatsApp</strong> pada kolom Nomor Telepon. Anda akan dialihkan untuk mengirimkan kode ke bot."
    },
    {
      emoji: "🔗",
      title: "3. Pairing Perangkat (Opsional)",
      desc: "Ingin pasangan/anggota keluarga juga bisa mencatat ke akun ini? Validasi akun WA Anda terlebih dahulu, lalu minta mereka mengetik <strong>!link idunik</strong> ke bot Kainest untuk mendapatkan kode penyambungan."
    },
    {
      emoji: "👨‍👩‍👧‍👦",
      title: "4. Integrasi ke Grup",
      desc: "Setelah akun Anda tervalidasi, Anda bisa mengundang nomor bot Kainest ke dalam Grup WhatsApp (Keluarga/Pasangan). Setelah bot masuk grup, cukup ketik <strong>!aktifkan-kainest</strong> di grup tersebut agar bot siap melayani perintah dari grup."
    },
    {
      emoji: "💬",
      title: "5. Mulai Mencatat Cepat",
      desc: "Selesai! Sekarang Anda cukup ketik <strong>'Makan siang 25k'</strong> atau <strong>'Beli bensin 50k'</strong> ke bot WA, dan AI kami akan otomatis memisahkannya ke kantong yang tepat!"
    }
  ],

  transactions: [
    {
      emoji: "💳",
      title: "Riwayat Transaksi",
      desc: "Halaman ini mencatat semua pengeluaran Anda. Anda dapat mengedit, menghapus, atau melihat rincian setiap transaksi."
    },
    {
      emoji: "🔍",
      title: "Filter Pencarian",
      desc: "Gunakan panel filter di atas untuk mencari transaksi berdasarkan <strong>tanggal</strong>, <strong>kategori (kantong)</strong>, atau urutan dari yang terbaru hingga terlama."
    }
  ],

  history: [
    {
      emoji: "📊",
      title: "Grafik & Kantong",
      desc: "Halaman ini memberikan ringkasan keuangan bulanan Anda secara visual melalui diagram."
    },
    {
      emoji: "📅",
      title: "Rincian per Bulan",
      desc: "Klik pada salah satu kartu bulan di bawah grafik untuk membuka (akordion) dan melihat sisa saldo di setiap kantong Anda pada bulan tersebut."
    }
  ],

  notes: [
    {
      emoji: "📝",
      title: "Catatan Kolaborasi",
      desc: "Buat catatan yang bisa dilihat bersama dengan anggota keluarga atau pasangan Anda. Cocok untuk daftar belanja, ide kado, atau planning liburan!"
    },
    {
      emoji: "📌",
      title: "Fitur Pin",
      desc: "Tekan tombol bintang (Bintangi) pada catatan yang penting agar selalu tampil di bagian paling atas."
    }
  ],

  todos: [
    {
      emoji: "✅",
      title: "Manajemen Tugas",
      desc: "Bagi tugas harian rumah tangga dengan pasangan. Siapa yang bertugas bayar listrik, buang sampah, atau menjemput anak?"
    },
    {
      emoji: "🔄",
      title: "Pembaruan Real-Time",
      desc: "Ketika Anda mencentang tugas selesai, statusnya akan langsung terlihat oleh anggota keluarga lain."
    }
  ],

  wabot: [
    {
      emoji: "🤖",
      title: "Pengaturan Bot",
      desc: "Di halaman ini Anda dapat menyesuaikan respons dan prompt dasar dari AI Bot WhatsApp yang Anda miliki."
    },
    {
      emoji: "🔑",
      title: "API Key",
      desc: "Jangan sebarkan API Key Groq/WaBot Anda kepada sembarang orang. Anda dapat mengubahnya sewaktu-waktu."
    }
  ],

  users: [
    {
      emoji: "👥",
      title: "Manajemen Pengguna",
      desc: "Hanya Admin yang dapat mengakses halaman ini untuk mengatur pengguna lain di dalam aplikasi Kainest."
    },
    {
      emoji: "🛡️",
      title: "Role & Hak Akses",
      desc: "Ubah <em>role</em> pengguna menjadi Admin atau Member, serta cabut hak akses mereka jika melanggar ketentuan."
    }
  ]
};
