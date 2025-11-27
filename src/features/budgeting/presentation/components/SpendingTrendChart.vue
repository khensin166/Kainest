<script setup>
// Import komponen Line dari vue-chartjs
import { Line } from 'vue-chartjs'

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

// Konfigurasi Opsi Visual Grafik (Agar terlihat modern & bersih)
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Agar bisa mengisi container induknya
  plugins: {
    legend: {
      display: false // Sembunyikan legend karena judul card sudah cukup menjelaskan
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1f2937', // gray-800
      bodyColor: '#1f2937',
      borderColor: '#e5e7eb', // gray-200
      borderWidth: 1,
      callbacks: {
        // Format angka di tooltip jadi Rupiah
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
              label += ': ';
          }
          if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(context.parsed.y);
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
        color: 'rgba(200, 200, 200, 0.2)', // Garis grid horizontal tipis
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
  <Line :data="chartData" :options="chartOptions" />
</template>