import React, { useEffect, useRef } from 'react'
import { getStyle } from '@coreui/utils'
import { CChart } from '@coreui/react-chartjs'

export const ChartDoughnutAndPieExample = (props) => {
  const chartRef = useRef(null)
  const { earnings, withdrawals, isLightMode } = props;

  useEffect(() => {
    const handleColorSchemeChange = () => {
      const chartInstance = chartRef.current
      if (chartInstance) {
        const { options } = chartInstance

        if (options.plugins?.legend?.labels) {
          options.plugins.legend.labels.color = getStyle('--cui-body-color')
        }

        chartInstance.update()
      }
    }

    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange)

    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange)
    }
  }, [])

  const data = {
    labels: earnings ? 'earnings' : 'withdrawals',
    datasets: [
      {
        backgroundColor: withdrawals ? '#9172EC' : isLightMode ? 'black' : 'white',
        data: earnings ? earnings : withdrawals,
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        labels: {
          color: getStyle('--cui-body-color'),
        },
      },
    },
  }

  return <CChart type="doughnut" data={data} options={options} ref={chartRef} />
}
