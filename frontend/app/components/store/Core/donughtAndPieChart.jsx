import React, { useEffect, useRef } from 'react'
import { getStyle } from '@coreui/utils'
import { CChart } from '@coreui/react-chartjs'

const ChartDoughnutAndPie = (props) => {
  const chartRef = useRef(null)
  const { earnings = 0, withdrawals, canWithdraw = 0, isLightMode } = props;
  let val = earnings ? earnings : withdrawals ? withdrawals : canWithdraw

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
        backgroundColor: ['#ffffff', '#E06A4A', isLightMode ? '#000000' : '#9172EC',],
        borderColor: isLightMode ? '#9172EC' : '#000000',
        data: [earnings, withdrawals ?? 0, canWithdraw],
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
        color: isLightMode ? '#000000' : '#ffffff',
        font: {
          weight: 'bold',
        },
      },
    },
  }

  return <CChart type="doughnut" data={data} options={options} ref={chartRef} />
}

export default ChartDoughnutAndPie

