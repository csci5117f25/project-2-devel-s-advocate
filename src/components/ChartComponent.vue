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
    title: { display: false, text: props.title },
  },
  scales: {
    x: { grid: { color: '#f4f3ef' } },
    y: { beginAtZero: true, grid: { color: '#f4f3ef' } },
  },
}

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.destroy()

  // Show only the newest 5 points
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
  <canvas ref="chartRef" id="chart" style="height: 300px; width: 100%" class="mx-3 my-15"></canvas>
</template>

<style scoped>
@media (min-width: 1024px) {
  #chart {
    margin-block: calc(var(--spacing) * 5);
  }
}
</style>
