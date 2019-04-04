import React from "react"
import { mount } from "enzyme"
import { Search, NotFound } from "../pages"
import { MemoryRouter } from "react-router-dom"
import routes from "../routes"

describe("Unit Test Suite for <App /> Component", () => {
  it("invalid path should redirect to 404", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/random"]} initialIndex={0}>
        {routes}
      </MemoryRouter>
    )

    expect(wrapper.find(NotFound)).toHaveLength(1)
  })

  it("valid path should not redirect to 404", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/"]} initialIndex={0}>
        {routes}
      </MemoryRouter>
    )

    expect(wrapper.find(NotFound)).toHaveLength(0)
  })

  it("Valid search path goes to search page", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/search/test"]} initialIndex={0}>
        {routes}
      </MemoryRouter>
    )

    expect(wrapper.find(Search)).toHaveLength(1)
  })
})
