// notify.js — SATU PINTU untuk seluruh notifikasi ringan (toast).
//
// Aturan kanal di Kainest:
//   - toast  : memberi tahu hasil. Tidak menghalangi, hilang sendiri.
//   - modal  : meminta keputusan (konfirmasi) atau menyampaikan hambatan
//              yang harus ditanggapi di tempat lain. Lihat modalStore.
//
// Sebelum berkas ini ada, 11 berkas mengimpor `vue3-toastify` sendiri-sendiri
// tanpa konfigurasi, sehingga durasi dan posisinya mengikuti bawaan pustaka dan
// tidak bisa diseragamkan. Semua pemanggilan sekarang lewat sini.
import { toast } from "vue3-toastify";

// Tema gelap dipakai oleh .dark dan .theme-spidey; .theme-factory tetap terang.
const temaToast = () => {
  const c = document.documentElement.classList;
  return c.contains("dark") || c.contains("theme-spidey") ? "dark" : "light";
};

const DURASI_SUKSES = 2500;
const DURASI_GALAT = 4000; // lebih lama: pesan galat perlu sempat terbaca

const opsi = (autoClose) => ({
  autoClose,
  position: toast.POSITION.TOP_RIGHT,
  theme: temaToast(),
  hideProgressBar: false,
});

/**
 * Galat yang SUDAH ditangani di tempat lain (mis. 403 yang memunculkan modal
 * global di apiClient) ditandai `__handled`. Tanpa penjagaan ini satu galat
 * memunculkan dua notifikasi sekaligus: modal DAN toast.
 */
const sudahDitangani = (sumber) =>
  Boolean(sumber && typeof sumber === "object" && sumber.__handled);

export const notify = {
  success(pesan) {
    if (!pesan) return;
    toast.success(pesan, opsi(DURASI_SUKSES));
  },

  /**
   * @param {string} pesan
   * @param {object} [sumber] objek Failure/Error asli, untuk memeriksa __handled
   */
  error(pesan, sumber) {
    if (!pesan || sudahDitangani(sumber)) return;
    toast.error(pesan, opsi(DURASI_GALAT));
  },

  warning(pesan, sumber) {
    if (!pesan || sudahDitangani(sumber)) return;
    toast.warning(pesan, opsi(DURASI_GALAT));
  },

  info(pesan) {
    if (!pesan) return;
    toast.info(pesan, opsi(DURASI_SUKSES));
  },
};

export default notify;
