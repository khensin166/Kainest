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
      title: "2. Hubungkan WhatsApp Bot",
      desc: "Mulai pencatatan otomatis via WhatsApp! Buka <strong>Profil (kanan atas)</strong> ➡️ <strong>Pasangan</strong> ➡️ Salin kode tautanmu. Buat Grup WA baru, masukkan bot, lalu kirim kode itu di dalam grup. Akun dan grup langsung aktif sekaligus!"
    },
    {
      emoji: "👨‍👩‍👧‍👦",
      title: "3. Integrasi ke Grup",
      desc: "Ingin pasangan/keluarga bisa mencatat di satu tempat? Buat Grup WhatsApp bersama, undang bot Kainest, lalu kirimkan kode <strong>!link KODE_KAMU</strong> langsung di dalam grup tersebut. Grup otomatis aktif dan siap digunakan bersama!"
    },
    {
      emoji: "💬",
      title: "4. Mulai Mencatat Cepat",
      desc: "Selesai! Cukup ketik <strong>'Makan siang 25k'</strong> atau <strong>'Beli bensin 50k'</strong> ke bot, dan AI Kainest akan otomatis memisahkannya ke kantong yang tepat. Ketik <strong>!help</strong> di WhatsApp untuk melihat semua perintah yang tersedia."
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
