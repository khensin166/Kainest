// Merepresentasikan satu titik data pada grafik garis (Tanggal X dan Nilai Y)
export class TrendDataEntity {
  constructor({ date, amount }) {
    // Format date: YYYY-MM-DD
    this.date = date; 
    // Pastikan amount angka, default 0 jika tidak ada data
    this.amount = Number(amount) || 0;
  }
  
  // Helper: Ambil hanya tanggalnya saja (misal "Tgl 25") untuk label sumbu X grafik
  get labelDay() {
    if (!this.date) return '';
    const day = new Date(this.date).getDate();
    return `${day}`;
  }
}