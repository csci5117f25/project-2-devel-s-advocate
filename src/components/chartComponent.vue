<script setup>
import { ref, watch, defineProps, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps({
  labels: { type: Array, default: () => [] },
  datasets: { type: Array, default: () => [] },
  title: { type: String, default: 'Chart' }
})

const chartRef = ref(null)
let chartInstance = null

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'top' },
    title: { display: true, text: props.title }
  },
  scales: { y: { beginAtZero: true } }
}

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: { labels: props.labels, datasets: props.datasets },
    options: chartOptions
  })
}

onMounted(() => initChart())

watch([() => props.labels, () => props.datasets], () => initChart(), { deep: true })
</script>

<template>
  <canvas ref="chartRef" style="height:180px; width:100%"></canvas>
</template>
