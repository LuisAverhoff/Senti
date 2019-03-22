import React from "react"
import { Pie } from "react-chartjs-2"
import { ChartOptions } from "chart.js"
import { CreateSkeletonLoader } from "../../Loader"
import { PieRectSkeleton } from "../../../constants"

export interface ChartProps {
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

const PieChart: React.FunctionComponent<ChartProps> = props => {
  const { data, width, height, ...rest } = props

  /* 
    We are forcing typescript to recognize that datasets and data cannot be undefined(! operator)
    simply because we initialized them with default props.
  */

  return data.datasets![0].data!.length > 0 ? (
    <Pie data={data} width={width} height={height} {...rest} />
  ) : (
    <CreateSkeletonLoader
      width={width}
      height={height}
      skeleton={PieRectSkeleton}
    />
  )
}

PieChart.defaultProps = {
  data: {
    labels: [],
    datasets: [{ data: [] }]
  },
  width: 640,
  height: 480,
  options: {}
}

export { PieChart }
