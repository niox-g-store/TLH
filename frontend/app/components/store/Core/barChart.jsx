import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

const BarChart = (props) => {
  const { incomeData, labels } = props;

  const data = {
    labels,
    datasets: [
      {
        label: 'Daily Income (₦)',
        data: incomeData,
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
