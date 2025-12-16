<script setup>
import { ref, watch, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)
Chart.defaults.color = '#f4f3ef'

const props = defineProps({
  labels: { type: Array, default: () => [] },
  datasets: { type: Array, default: () => [] },
  title: { type: String, default: 'Chart' },
})

const chartRef = ref(null)
let chartInstance = null

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // fill container like heat map
  plugins: {
    legend: { display: true, position: 'top' },
    title: { display: false, text: props.title },
  },
  scales: {
    x: {
      grid: { color: '#f4f3ef' },
      ticks: {
        autoSkip: false,
        maxRotation: 0, // keep labels horizontal
        minRotation: 0,
        callback: function(value, index) {
          const label = this.getLabelForValue(value);

          //mobile screens show mm-dd
          if (window.innerWidth < 640 && props.labels.length >= 4) {
            const dates = label.split('-');
            return dates[1] + '-' + dates[2];
          }

          return label;
        },
      },
    },
    y: { beginAtZero: true, grid: { color: '#f4f3ef' } },
  },
}

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.destroy()

  // Show only the newest 7 points
  const last7 = 7
  const labels = props.labels.slice(-last7)
  const datasets = props.datasets.map((d) => ({
    ...d,
    data: d.data.slice(-last7),
  }))

  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: { labels, datasets },
    options: chartOptions,
  })
}

onMounted(() => initChart())

watch([() => props.labels, () => props.datasets], () => initChart(), { deep: true })
</script>

<template>
  <div class="chart-wrapper w-full h-full">
    <canvas ref="chartRef" class="w-full h-full"></canvas>
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  min-height: 340px;
}

@media (min-width: 640px) {
  .chart-wrapper {
    min-height: 420px;
  }
}

@media (min-width: 1024px) {
  .chart-wrapper {
    height: 520px; /* or any desired desktop height, see if this works for everyone laptop*/
  }
}
</style>
