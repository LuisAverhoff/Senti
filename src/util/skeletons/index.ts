import { SVGProps } from "react"

export const PieChartSkeleton = (width: number, height: number) => {
  const cx = width / 2
  const cy = height / 2

  const skeleton: Array<SVGProps<any>> = [
    {
      type: "circle",
      cx: cx,
      cy: cy,
      r: cy
    }
  ]

  return skeleton
}

export const BarChartSkeleton = (width: number, height: number) => {
  const skeleton: Array<SVGProps<any>> = [
    {
      type: "rect",
      x: 0,
      y: 0,
      rx: 5,
      ry: 5,
      width: width - 50,
      height: 40
    },
    {
      type: "rect",
      x: 0,
      y: 55,
      rx: 5,
      ry: 5,
      width: 40,
      height: height - 110
    },
    {
      type: "rect",
      x: 50,
      y: 55,
      rx: 5,
      ry: 5,
      width: width - 100,
      height: height - 110
    },
    {
      type: "rect",
      x: 0,
      y: height - 40,
      rx: 5,
      ry: 5,
      width: width - 50,
      height: 40
    }
  ]

  return skeleton
}
