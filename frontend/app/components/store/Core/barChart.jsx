import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

const BarChart = () => {
  const labels = [
    'Jun 1', 'Jun 3', 'Jun 5', 'Jun 7', 'Jun 9',
    'Jun 11', 'Jun 13', 'Jun 15', 'Jun 17', 'Jun 19',
    'Jun 21', 'Jun 23', 'Jun 25', 'Jun 27', 'Jun 29', 'Jun 30'
  ]

  const data = {
    labels,
    datasets: [
      {
        label: 'Daily Income (₦)',
        data: [
          30000, 35000, 42000, 25000, 30000,
          52000, 60000, 45000, 47000, 70000,
          55000, 50000, 48000, 62000, 58000, 61000
        ],
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 5,
        barThickness: 8,
        maxBarThickness: 12,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
          font: { size: 9 },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: '#ffffff',
          callback: (value) => `₦${value.toLocaleString()}`,
        },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `₦${tooltipItem.formattedValue}`
          },
        },
      },
    },
  }

  return (
    <div style={{ height: 'inherit' }}>
      <Bar data={data} options={options} />
    </div>
  )
}

export default BarChart
