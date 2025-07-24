import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler)

function trimZerosFromStart(labels, data) {
  const firstNonZeroIndex = data?.findIndex(v => v > 0);

  const start = Math.max(0, firstNonZeroIndex - 2);
  const end = Math.min(data?.length, start + 11);

  return {
    labels: labels?.slice(start, end),
    data: data?.slice(start, end),
  };
}

const ChartLine = ({ ticket }) => {
  const trimmed = trimZerosFromStart(ticket?.labels, ticket?.data);
  const data = {
    labels: trimmed?.labels,
    datasets: [
      {
        label: 'Tickets Sold',
        data: trimmed?.data,
        fill: false,
        tension: 0.1,
        borderColor: 'rgba(255,255,255,0.8)',
        backgroundColor: 'rgba(255,255,255,0.8)',
        pointBackgroundColor: '#fff',
        pointBorderColor: 'rgba(255,255,255,0.8)',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 6,
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
      <Line data={data} options={options} />
    </div>
  )
}

export default ChartLine
