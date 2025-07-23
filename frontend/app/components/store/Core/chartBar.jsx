import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

const ChartBar = () => {
  const data = {
    labels: ['Jun 1', 'Jun 5', 'Jun 10', 'Jun 15', 'Jun 20', 'Jun 25', 'Jun 30'],
    datasets: [
      {
        label: 'Tickets Sold',
        data: [10, 40, 30, 50, 80, 60, 50],
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
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue} tickets`
          },
        },
      },
    },
  }

  return (
    <div style={{ height: '60px' }}>
      <Bar data={data} options={options} />
    </div>
  )
}

export default ChartBar
