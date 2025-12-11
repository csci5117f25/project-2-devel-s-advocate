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
  plugins: {
    legend: { display: true, position: 'top' },
    title: { display: true, text: props.title },
  },
  scales: {
    x: { grid: { color: '#f4f3ef' } },
    y: { beginAtZero: true, grid: { color: '#f4f3ef' } },
  },
}

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: { labels: props.labels, datasets: props.datasets },
    options: chartOptions,
  })
}

onMounted(() => initChart())

watch([() => props.labels, () => props.datasets], () => initChart(), { deep: true })
</script>

<template>
  <canvas ref="chartRef" style="height: 200px; width: 100%"></canvas>
</template>
