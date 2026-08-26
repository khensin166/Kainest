<!-- SpendingTrendCard.vue -->
<script setup>
// Import komponen Line dari vue-chartjs
import { Line as LineChart } from 'vue-chartjs'
import { formatRupiah } from '@/utils/Utils'

// Import bagian-bagian penting dari Chart.js core
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Dibutuhkan untuk area fill di bawah garis
} from 'chart.js'

// Registrasi komponen Chart.js yang akan dipakai.
// Ini wajib dilakukan di Chart.js versi baru agar tree-shaking berfungsi.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Menerima props 'chartData' dari parent (Dashboard)
// Struktur datanya harus sesuai dengan format Chart.js { labels: [], datasets: [] }
const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

// Helper: ambil CSS variable dari tema aktif (light/dark)
const getCssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()

// Konfigurasi Opsi Visual Grafik (Agar terlihat modern & bersih)
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Agar bisa mengisi container induknya
  plugins: {
    legend: {
      display: true, // Tampilkan legend untuk membedakan garis pengeluaran & pemasukan
      position: 'top',
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        padding: 14,
        font: { size: 11 }
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      get backgroundColor() { return getCssVar('--color-chart-tooltip-bg') || 'rgba(255,255,255,0.9)' },
      get titleColor()      { return getCssVar('--color-chart-tooltip-text') || '#1f2937' },
      get bodyColor()       { return getCssVar('--color-chart-tooltip-text') || '#1f2937' },
      get borderColor()     { return getCssVar('--color-chart-tooltip-border') || '#e5e7eb' },
      borderWidth: 1,
      callbacks: {
        // Format angka di tooltip jadi Rupiah
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
              label += ': ';
          }
          if (context.parsed.y !== null) {
              label += formatRupiah(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false // Sembunyikan garis grid vertikal agar bersih
      },
      ticks: {
        maxTicksLimit: 10 // Batasi jumlah label tanggal agar tidak berdempetan
      }
    },
    y: {
      beginAtZero: true, // Sumbu Y selalu mulai dari 0
      grid: {
        get color() { return getCssVar('--color-chart-grid') || 'rgba(200,200,200,0.2)' }, // Garis grid horizontal tipis
        borderDash: [5, 5] // Garis putus-putus
      },
      ticks: {
        // Format angka sumbu Y jadi '50rb', '100rb' agar hemat tempat
        callback: function(value) {
           if (value >= 1000) {
              return 'Rp ' + (value / 1000).toFixed(0) + 'rb';
           }
           return 'Rp ' + value;
        }
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  },
  elements: {
    point: {
      radius: 0, // Sembunyikan titik data secara default
      hoverRadius: 6 // Tampilkan titik saat di-hover
    }
  }
}
</script>

<template>
  <LineChart :data="chartData" :options="chartOptions" />
</template>