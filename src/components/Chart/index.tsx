import React, { SVGProps } from "react"
import { ChartData } from "chart.js"
import ChartComponent, { ChartComponentProps } from "react-chartjs-2"
import CreateSkeletonLoader from "../Loader"

interface ChartProps extends ChartComponentProps {
  data: ChartData
  width: number
  height: number
  skeleton(width: number, height: number): Array<SVGProps<any>>
  skeletonStyle?: React.CSSProperties
}

const Chart: React.FunctionComponent<ChartProps> = props => {
  const { data, skeleton, skeletonStyle, width, height, ...rest } = props
  /* 
    We are forcing typescript to recognize that datasets and data cannot be undefined(! operator)
    simply because we initialized them with default props.
  */

  return data.datasets![0].data!.length > 0 ? (
    <ChartComponent data={data} width={width} height={height} {...rest} />
  ) : (
    <CreateSkeletonLoader
      width={width}
      height={height}
      skeleton={skeleton(width, height)}
      style={skeletonStyle}
    />
  )
}

Chart.defaultProps = {
  data: {
    labels: [],
    datasets: [{ data: [] }]
  },
  width: 640,
  height: 480,
  options: {}
}

export { Chart }
