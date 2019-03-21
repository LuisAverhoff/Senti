import React from "react"
import { Line } from "react-chartjs-2"
import { ChartOptions } from "chart.js"
import { CreateSkeletonLoader } from "../../Loader"
import { chartRectSkeleton } from "../../../constants"

interface LineChartProps {
  /*
   * The data that will be displayed on the chart.
   */
  data: Chart.ChartData
  /*
   * The width of the chart.
   */
  width: number
  /*
   * The height of the chart.
   */
  height: number
  /*
   * Set this property if you would like to change how the graph looks and is animated.
   */
  options?: ChartOptions
}

const LineChart: React.FunctionComponent<LineChartProps> = props => {
  const { data, width, height, ...rest } = props

  /* 
    We are forcing typescript to recognize that datasets and data cannot be undefined(! operator)
    simply because we initialized them with default props.
  */

  console.log(data.datasets![0].data!.length > 0)

  return data.datasets![0].data!.length > 0 ? (
    <Line data={data} width={width} height={height} {...rest} />
  ) : (
    <CreateSkeletonLoader
      width={width}
      height={height}
      rects={chartRectSkeleton}
    />
  )
}

LineChart.defaultProps = {
  data: { labels: [], datasets: [{ data: [] }] },
  width: 800,
  height: 600,
  options: {}
}

export { LineChart }
