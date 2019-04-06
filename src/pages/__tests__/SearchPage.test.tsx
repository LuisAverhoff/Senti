import React from "react"
import { Search } from "../Search"
import { createShallow } from "@material-ui/core/test-utils"
import { createMemoryHistory } from "history"

describe("Unit Test Suite for <Search /> page", () => {
  const emptyMockFunction: any = jest.fn(() => {})
  const shallow = createShallow({ dive: true })

  it("The data in the pie chart has should be updated based on the polarity index received", () => {
    const wrapper = shallow(
      <Search
        match={{
          params: { query: "test" },
          isExact: false,
          path: "/search/:query",
          url: "http:localhost:8000"
        }}
        location={emptyMockFunction}
        history={createMemoryHistory()}
      />
    )

    const searchComponent = wrapper.instance() as any
    searchComponent.handleMessage({ polarityIndex: 0, hashtags: {} })
    expect(wrapper.find({ type: "pie" }).props().data.datasets[0].data).toEqual(
      [1, 0, 0]
    )
  })

  it("The bar chart should have the top 5 hashtags", () => {
    const wrapper = shallow(
      <Search
        match={{
          params: { query: "test" },
          isExact: false,
          path: "/search/:query",
          url: "http:localhost:8000"
        }}
        location={emptyMockFunction}
        history={createMemoryHistory()}
      />
    )

    const searchComponent = wrapper.instance() as any
    searchComponent.handleMessage({
      polarityIndex: 0,
      hashtags: {
        test1: 10,
        test2: 1,
        test3: 7,
        test4: 2,
        test5: 17,
        test6: 5,
        test7: 20
      }
    })
    expect(wrapper.find({ type: "bar" }).props().data.datasets[0].data).toEqual(
      [20, 17, 10, 7, 5]
    )
  })

  it("The bar and pie chart should reset when there is a new query", () => {
    const wrapper = shallow(
      <Search
        match={{
          params: { query: "test" },
          isExact: false,
          path: "/search/:query",
          url: "http:localhost:8000"
        }}
        location={emptyMockFunction}
        history={createMemoryHistory()}
      />
    )

    const searchComponent = wrapper.instance() as any
    searchComponent.handleMessage({
      polarityIndex: 0,
      hashtags: { test1: 10 }
    })

    searchComponent.HandleSearchRequest("new query")

    expect(wrapper.find({ type: "pie" }).props().data.datasets[0].data).toEqual(
      []
    )
    expect(wrapper.find({ type: "bar" }).props().data.datasets[0].data).toEqual(
      []
    )
  })

  it("The bar and pie chart should not reset when there is no new query", () => {
    const wrapper = shallow(
      <Search
        match={{
          params: { query: "test" },
          isExact: false,
          path: "/search/:query",
          url: "http:localhost:8000"
        }}
        location={emptyMockFunction}
        history={createMemoryHistory()}
      />
    )

    const searchComponent = wrapper.instance() as any
    searchComponent.handleMessage({
      polarityIndex: 0,
      hashtags: { test1: 10 }
    })

    searchComponent.HandleSearchRequest("")

    expect(wrapper.find({ type: "pie" }).props().data.datasets[0].data).toEqual(
      [1, 0, 0]
    )
    expect(wrapper.find({ type: "bar" }).props().data.datasets[0].data).toEqual(
      [10]
    )
  })
})
