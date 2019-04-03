import React from "react"
import Enzyme, { shallow, mount } from "enzyme"
import App from "../App"
import Adapter from "enzyme-adapter-react-16"

Enzyme.configure({ adapter: new Adapter() })

describe("Unit Test Suite for App Component", () => {
  it("renders without crashing", () => {
    const AppComponent = shallow(<App />)
    expect(AppComponent.exists()).toBe(true)
  })
})
