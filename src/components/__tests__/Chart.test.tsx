import React from "react"
import Chart from "../Chart"
import { shallow } from "enzyme"
import { ChartData } from "chart.js"
import { PieChartSkeleton } from "../../util/skeletons"
import CreateSkeletonLoader from "../Loader"

describe("Unit Test Suite for <Chart /> Component", () => {
  const skeletonPieMockFunction = jest.fn(PieChartSkeleton)

  it("renders chart without crashing", () => {
    const mockPieData: ChartData = {
      labels: ["Label1", "Label2", "Label3"],
      datasets: [{ data: [1, 1, 1] }]
    }

    const wrapper = shallow(
      <Chart
        type='pie'
        data={mockPieData}
        width={800}
        height={600}
        skeleton={skeletonPieMockFunction}
      />
    )

    expect(wrapper.exists()).toBe(true)
  })

  it("show loader if no data is available", () => {
    const mockPieData: ChartData = {
      labels: [],
      datasets: [{ data: [] }]
    }

    const wrapper = shallow(
      <Chart
        type='pie'
        data={mockPieData}
        width={800}
        height={600}
        skeleton={skeletonPieMockFunction}
      />
    )

    expect(wrapper.find(CreateSkeletonLoader).exists()).toBe(true)
  })
})
