// components/ChartBubble.jsx
import { Bubble } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  CategoryScale,
} from 'chart.js'

ChartJS.register(LinearScale, PointElement, Tooltip, CategoryScale)

const ChartBubble = () => {
  const data = {
    datasets: [
      {
        label: 'Bubble Data',
        data: [
          { x: 10, y: 20, r: 8 },
          { x: 15, y: 10, r: 10 },
          { x: 25, y: 30, r: 12 },
          { x: 40, y: 20, r: 6 },
        ],
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderColor: 'rgba(255,255,255,1)',
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
        callbacks: {
          label: function (ctx) {
            const { x, y, r } = ctx.raw
            return `x: ${x}, y: ${y}, size: ${r}`
          },
        },
      },
    },
  }

  return (
    <div style={{ height: '60px' }}>
      <Bubble data={data} options={options} />
    </div>
  )
}

export default ChartBubble
