/**
 * Konfigurasi terpusat untuk teks panduan (PageGuide) di seluruh halaman aplikasi Kainest.
 * Setiap key merepresentasikan nama halaman/modul.
 */
export const pageGuides = {
  budgeting: [
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

  plans: [
    {
      title: "Satu tempat untuk yang sudah dijanjikan",
      desc: "Halaman ini menjawab pertanyaan <b>\"uang saya sudah dijanjikan ke mana?\"</b>. Kantong Keuangan menjawab berapa yang boleh dihabiskan; di sini kamu melihat berapa yang sebenarnya sudah bukan milikmu lagi.",
    },
    {
      title: "Bar hijau/kuning/merah di atas",
      desc: "Angkanya adalah <b>sisa aman</b>: seluruh uang yang masih bisa dipakai, dikurangi tagihan yang belum dibayar dan tabungan yang belum disetor. Merah berarti uangmu tidak akan cukup untuk tagihan bulan ini.",
    },
    {
      title: "Tagihan hanya berkurang bila kamu bilang sudah bayar",
      desc: "Sistem tidak pernah mencatat pengeluaran sendiri. Tekan <b>Tandai Lunas</b> dan barulah tercatat sebagai pengeluaran yang memotong kantongnya. Tekan <b>Lewati</b> bila bulan ini dibayar orang lain — budgetmu tidak berkurang sama sekali.",
    },
    {
      title: "Cicilan berhenti menagih sendiri",
      desc: "Isi <b>jumlah angsuran</b> saat membuat tagihan, misalnya 12 untuk cicilan setahun. Setelah angsuran terakhir lunas, tagihan itu otomatis berhenti muncul — kamu tidak perlu ingat mematikannya.",
    },
    {
      title: "Nominal boleh dikoreksi saat membayar",
      desc: "Listrik didaftarkan Rp350.000 tapi tagihan aslinya Rp412.000? Isi angka yang sebenarnya saat menandai lunas. Perkiraan di tagihan tetap seperti semula.",
    },
    {
      title: "Tabungan memotong budget, tapi bukan pengeluaran",
      desc: "Nominal <b>sisihkan per bulan</b> langsung mengurangi uang yang boleh kamu pakai, sama seperti kantong. Tapi setoran tabungan <b>tidak</b> muncul di grafik pengeluaran — ia pemindahan uang, bukan konsumsi.",
    },
    {
      title: "Butuh uangnya kembali? Tarik saja",
      desc: "Penarikan dicatat sebagai baris tersendiri, bukan dengan menghapus setoran lama, supaya riwayatmu tetap jujur.",
    },
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
  ],

  dashboard: [
    {
      emoji: "👋",
      title: "Ringkasan Harian",
      desc: "Halaman pertama yang Anda lihat setelah masuk. Empat kartu di atas menampilkan <strong>total pengeluaran</strong>, <strong>gaji utama</strong>, <strong>sisa gaji pokok</strong>, dan <strong>pemasukan tambahan</strong> bulan berjalan."
    },
    {
      emoji: "📈",
      title: "Perbandingan Bulan Lalu",
      desc: "Angka kecil berwarna di bawah tiap kartu adalah perbandingan dengan bulan sebelumnya. Hijau berarti membaik, merah berarti perlu diperhatikan. Kalau tidak ada perubahan, badge-nya memang sengaja disembunyikan."
    },
    {
      emoji: "🕒",
      title: "Aktivitas Terbaru",
      desc: "Enam transaksi terakhir Anda, termasuk yang dicatat lewat WhatsApp. Klik <strong>Lihat Semua</strong> untuk membuka Riwayat Transaksi lengkap dengan filter."
    },
    {
      emoji: "📣",
      title: "Kabar & Ulasan",
      desc: "Panel kanan berisi <strong>System Updates</strong> (fitur baru yang baru dirilis) dan <strong>Ulasan Pengguna</strong>. Anda bisa ikut menulis ulasan di kolom paling bawah."
    }
  ],

  split: [
    {
      emoji: "🧾",
      title: "1. Unggah Foto Struk",
      desc: "Ambil foto struk atau pilih dari galeri, lalu tekan <strong>Scan Struk</strong>. Pastikan tulisan pada struk terbaca jelas agar hasil pemindaian akurat."
    },
    {
      emoji: "🤖",
      title: "2. AI Membaca Struk",
      desc: "Kainest akan otomatis mengurai nama tempat, daftar menu, pajak, dan diskon. Anda tetap bisa memperbaiki angkanya secara manual bila ada yang meleset."
    },
    {
      emoji: "🙋",
      title: "3. Tandai Siapa Makan Apa",
      desc: "Tambahkan nama teman yang ikut patungan, lalu centang menu yang dimakan masing-masing. Pajak dan diskon dibagi otomatis secara proporsional — bukan dibagi rata."
    },
    {
      emoji: "🔗",
      title: "4. Bagikan Tagihan",
      desc: "Hasil perhitungan bisa dibagikan lewat tautan, atau dikirim langsung ke grup/nomor WhatsApp. Teman Anda tidak perlu punya akun Kainest untuk membukanya."
    }
  ],

  noteEditor: [
    {
      emoji: "✍️",
      title: "Menulis Catatan",
      desc: "Editor ini mendukung judul, daftar, dan gambar. Tekan <strong>Enter</strong> untuk membuat blok baru, atau gunakan tombol <strong>+</strong> di kiri untuk menyisipkan jenis blok lain."
    },
    {
      emoji: "🔒",
      title: "Berbagi & Izin",
      desc: "Lewat tombol <strong>Bagikan</strong>, catatan bisa dibuka ke publik lewat tautan, atau dibagikan khusus ke pasangan dengan izin <strong>Hanya Melihat</strong> atau <strong>Bisa Mengedit</strong>."
    }
  ],

  wabotApi: [
    {
      emoji: "📣",
      title: "Kirim Pengumuman Massal",
      desc: "Halaman khusus admin untuk mengirim satu pesan ke banyak grup WhatsApp sekaligus — misalnya saat ada pembaruan sistem atau permintaan relink."
    },
    {
      emoji: "✅",
      title: "Pilih Grup Tujuan",
      desc: "Klik angka <strong>Total Grup</strong>, <strong>Terhubung</strong>, atau <strong>Perlu Relink</strong> untuk menyaring daftar. Centang grup yang dituju, atau gunakan <strong>Pilih Semua</strong>."
    },
    {
      emoji: "⚡",
      title: "Template Cepat",
      desc: "Tiga tombol template mengisi pesan secara otomatis untuk kasus yang sering dipakai. Isinya tetap bisa Anda sunting sebelum dikirim."
    },
    {
      emoji: "🐢",
      title: "Pengiriman Bertahap",
      desc: "Pesan dikirim satu per satu dengan jeda 1,5 detik antar grup. Jeda ini sengaja ada untuk menjaga keamanan akun WhatsApp Anda — jangan menutup halaman saat proses berjalan."
    }
  ],

  wabotBackup: [
    {
      emoji: "💾",
      title: "Cadangkan Percakapan",
      desc: "Daftarkan Chat atau Grup WhatsApp agar pesannya tersimpan otomatis ke database Kainest. Berguna untuk menelusuri kembali transaksi yang pernah dicatat lewat chat."
    },
    {
      emoji: "🔑",
      title: "Butuh Koneksi Bot",
      desc: "Fitur ini memerlukan <strong>Base URL</strong> dan <strong>API Key</strong> bot yang aktif. Bila statusnya masih <em>Terputus</em>, atur dulu koneksinya di halaman WhatsApp Bot."
    }
  ],

  settings: [
    {
      emoji: "👤",
      title: "Edit Profil",
      desc: "Ubah nama panggilan, nomor telepon, dan foto profil Anda. Nomor telepon dipakai untuk mencocokkan akun dengan WhatsApp saat mencatat lewat bot."
    },
    {
      emoji: "💑",
      title: "Tautkan Pasangan",
      desc: "Di tab <strong>Pasangan</strong> tersedia kode undangan Anda. Bagikan kode itu ke pasangan, atau masukkan kode miliknya, agar catatan dan keuangan bisa dikelola berdua."
    },
    {
      emoji: "🔐",
      title: "Keamanan",
      desc: "Tab <strong>Keamanan</strong> untuk mengganti kata sandi. Gunakan kata sandi yang berbeda dari akun lain, terutama karena aplikasi ini menyimpan data keuangan Anda."
    }
  ]
};
