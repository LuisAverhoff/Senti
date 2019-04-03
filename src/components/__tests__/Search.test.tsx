import React from "react"
import Enzyme, { shallow, mount } from "enzyme"
import SearchBar from "../Search"
import Adapter from "enzyme-adapter-react-16"

Enzyme.configure({ adapter: new Adapter() })

describe("Unit Test Suite for SearchBar Component", () => {
  it("renders without crashing", () => {
    const query = ""
    const SearchBarComponent = shallow(
      <SearchBar value={query} onChange={() => {}} onRequestSearch={() => {}} />
    )
    expect(SearchBarComponent.exists()).toBe(true)
  })
})
