import React, { useEffect, useRef } from 'react'
import { getStyle } from '@coreui/utils'
import { CChart } from '@coreui/react-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

const ChartDoughnutAndPie = (props) => {
  const chartRef = useRef(null)
  const { earnings = 0, withdrawals, commission = 0, isLightMode } = props;
  let val = earnings ? earnings : withdrawals ? withdrawals : commission

  const cappedVal = Math.min(val, 100000)
  const degrees = 180 + (cappedVal / 1000) * 180

  const circumference = (degrees * Math.PI) / 180

  useEffect(() => {
    const handleColorSchemeChange = () => {
      const chartInstance = chartRef.current
      if (chartInstance?.options?.plugins?.legend?.labels) {
        chartInstance.options.plugins.legend.labels.color = getStyle('--cui-body-color')
        chartInstance.update()
      }
    }

    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange)
    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange)
    }
  }, [])

  const data = {
    datasets: [
      {
        backgroundColor: [
          isLightMode ? '#000000' : '#ffffff',
          withdrawals !== undefined ? '#9172EC' : (isLightMode ? '#000000' : '#ffffff'),
          isLightMode ? '#000000' : '#ffffff',
        ],
        borderColor: isLightMode ? '#000' : '#fff',
        data: [earnings, withdrawals ?? 0, commission],
      },
    ],
  }

  const options = {
    circumference,
    animation: {
      animateRotate: true,
      duration: 1200,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        labels: {
          color: getStyle('--cui-body-color'),
        },
      },
      datalabels: {
        color: isLightMode ? '#fff' : '#000',
        font: {
          weight: 'bold',
        },
        formatter: (value) => '',
      },
    },
  }

  return <CChart type="doughnut" data={data} options={options} ref={chartRef} />
}

export default ChartDoughnutAndPie
