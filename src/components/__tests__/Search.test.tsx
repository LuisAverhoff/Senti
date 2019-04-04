import React from "react"
import { createShallow } from "@material-ui/core/test-utils"
import SearchBar from "../Search"

describe("Unit Test Suite for <SearchBar /> Component", () => {
  const shallow = createShallow({ dive: true })
  const emptyMockFunction = jest.fn((_value: string) => {})

  it("renders search bar without crashing", () => {
    const wrapper = shallow(
      <SearchBar
        value=''
        onChange={emptyMockFunction}
        onRequestSearch={emptyMockFunction}
      />
    )

    expect(wrapper.exists()).toBe(true)
  })

  it("query entered by user matches input.", () => {
    const onChangeMock = jest.fn((_value: string) => {
      console.log("onChange was called.")
    })

    const wrapper = shallow(
      <SearchBar
        value=''
        onChange={onChangeMock}
        onRequestSearch={emptyMockFunction}
      />
    )

    wrapper
      .find("WithStyles(Input)")
      .simulate("change", { target: { value: "Test" } })

    expect(onChangeMock.mock.calls[0][0]).toEqual("Test")
  })

  it("Search function gets called when user presses enter", () => {
    const onRequestSearchMock = jest.fn((_value: string) => {
      console.log("onRequestSearch was called.")
    })

    const wrapper = shallow(
      <SearchBar
        value=''
        onChange={emptyMockFunction}
        onRequestSearch={onRequestSearchMock}
      />
    )

    wrapper.find("WithStyles(Input)").simulate("keyup", { key: "Enter" })

    expect(onRequestSearchMock).toHaveBeenCalled()
  })

  it("Search function gets called when user clicks the search icon button", () => {
    const onRequestSearchMock = jest.fn((_value: string) => {
      console.log("onRequestSearch was called.")
    })

    const wrapper = shallow(
      <SearchBar
        value=''
        onChange={emptyMockFunction}
        onRequestSearch={onRequestSearchMock}
      />
    )

    wrapper.find("#searchIconButton").simulate("click")

    expect(onRequestSearchMock).toHaveBeenCalled()
  })

  it("Clean input of trailing spaces if empty", () => {
    const wrapper = shallow(
      <SearchBar
        value=''
        onChange={emptyMockFunction}
        onRequestSearch={emptyMockFunction}
      />
    )

    const input = wrapper.find("WithStyles(Input)")
    input.simulate("change", { target: { value: "    " } })
    input.simulate("blur")

    expect(input.props().value).toEqual("")
  })
})
