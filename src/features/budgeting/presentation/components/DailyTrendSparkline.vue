<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
)

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

// --- KONFIGURASI CHART MINIMALIS (SPARKLINE) ---
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, // Sembunyikan legend
    tooltip: {
      enabled: true, // Tooltip tetap aktif agar interaktif
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (context) {
          // Format Rupiah sederhana di tooltip
          if (context.parsed.y !== null) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(context.parsed.y);
          }
          return '';
        },
        title: () => null // Sembunyikan judul tanggal agar lebih ringkas
      }
    }
  },
  scales: {
    // SEMBUNYIKAN SEMUA SUMBU DAN GRID
    x: {
      display: false, // Tidak ada sumbu X (tanggal)
      grid: { display: false }
    },
    y: {
      display: false, // Tidak ada sumbu Y (nominal)
      grid: { display: false },
      beginAtZero: true
    }
  },
  elements: {
    point: {
      radius: 0, // Titik data tidak terlihat
      hoverRadius: 5 // Muncul saat di-hover
    },
    line: {
      borderWidth: 2, // Garis sedikit lebih tipis
      tension: 0.4 // Lebih melengkung (smooth)
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  },
  layout: {
    padding: { left: -10, right: 0, bottom: -10, top: 0 } // Hack agar grafik mepet ke pinggir container
  }
}
</script>

<template>
  <div style="height: 50px;">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>