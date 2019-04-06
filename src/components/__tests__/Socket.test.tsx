import React from "react"
import WS from "jest-websocket-mock"
import { shallow } from "enzyme"
import ReactWebsocket from "../Socket"

describe("Unit test for <ReactWebsocket /> component", () => {
  const fakeUrl = "ws://localhost:8000"
  const emptyMockFunction = jest.fn(() => {})

  it("The websocket is created with required props", () => {
    const wrapper = shallow(
      <ReactWebsocket url={fakeUrl} onMessage={emptyMockFunction} />
    )
    expect(wrapper.getElement()).toBe(null)
    wrapper.unmount()
  })

  it("The websocket successfully connects to the webserver", async () => {
    const onOpenMockFunction = jest.fn((_e: Event) => {
      console.log("onOpen function was called")
    })

    const mockServer = new WS(fakeUrl)
    const wrapper = shallow(
      <ReactWebsocket
        url={fakeUrl}
        onMessage={emptyMockFunction}
        onOpen={onOpenMockFunction}
      />
    )

    await mockServer.connected
    mockServer.close()

    expect(onOpenMockFunction.mock.calls.length).toBe(1)
    wrapper.unmount()
  })

  it("The websocket is disconnected from the webserver", async () => {
    const onCloseMockFunction = jest.fn((_code?: number, _reason?: string) => {
      console.log("onClose function was called")
    })

    const mockServer = new WS(fakeUrl)
    const wrapper = shallow(
      <ReactWebsocket
        url={fakeUrl}
        onMessage={emptyMockFunction}
        onClose={onCloseMockFunction}
      />
    )

    await mockServer.connected
    mockServer.close()

    expect(onCloseMockFunction.mock.calls.length).toBe(1)
    wrapper.unmount()
  })

  it("The websocket receives a message from the server", async () => {
    const onMessageMockFunction = jest.fn((data: any) => {
      console.log("onMessage function was called")
    })

    const mockServer = new WS(fakeUrl, { jsonProtocol: true })
    const wrapper = shallow(
      <ReactWebsocket url={fakeUrl} onMessage={onMessageMockFunction} />
    )

    await mockServer.connected
    mockServer.send({ type: "GREETING", payload: "hello" })
    mockServer.close()

    expect(onMessageMockFunction.mock.calls.length).toBe(1)
    wrapper.unmount()
  })

  it("The websocket is able to the send messages to the server", async () => {
    const mockServer = new WS(fakeUrl, { jsonProtocol: true })
    const wrapper = shallow(
      <ReactWebsocket url={fakeUrl} onMessage={emptyMockFunction} />
    )

    await mockServer.connected

    const client = wrapper.instance() as ReactWebsocket
    client.sendMessage({ track: "test" })

    await expect(mockServer).toReceiveMessage({ track: "test" })
    expect(mockServer).toHaveReceivedMessages([{ track: "test" }])

    mockServer.close()
    wrapper.unmount()
  })

  it("The websocket sends all stored messages to the server after reconnecting", async () => {
    const wrapper = shallow(
      <ReactWebsocket url={fakeUrl} onMessage={emptyMockFunction} />
    )

    const client = wrapper.instance() as ReactWebsocket
    client.sendMessage({ track: "test" })

    const mockServer = new WS(fakeUrl, { jsonProtocol: true })
    client.reconnect()

    await mockServer.connected
    await expect(mockServer).toReceiveMessage({ track: "test" })
    expect(mockServer).toHaveReceivedMessages([{ track: "test" }])

    mockServer.close()
    wrapper.unmount()
  })

  it("Attempt to reconnect to the webserver when autoreconnect is true", async done => {
    const onCloseMockFunction = jest.fn((_code?: number, _reason?: string) => {
      console.log("onClose function was called")
    })

    let mockServer = new WS(fakeUrl)
    const wrapper = shallow(
      <ReactWebsocket
        url={fakeUrl}
        onMessage={emptyMockFunction}
        autoReconnect={true}
        reconnectIntervalInMilliSeconds={100}
        onClose={onCloseMockFunction}
      />
    )

    await mockServer.connected
    mockServer.close()

    setTimeout(() => {
      expect(onCloseMockFunction.mock.calls.length).toBe(2)
      wrapper.unmount()
      done()
    }, 110)

    mockServer = new WS(fakeUrl)
    await mockServer.connected
    mockServer.close()
  })

  it("Dont reconnect when autoreconnect is false", async done => {
    const onCloseMockFunction = jest.fn((_code?: number, _reason?: string) => {
      console.log("onClose function was called")
    })

    const mockServer = new WS(fakeUrl)
    const wrapper = shallow(
      <ReactWebsocket
        url={fakeUrl}
        onMessage={emptyMockFunction}
        autoReconnect={false}
        reconnectIntervalInMilliSeconds={100}
        onClose={onCloseMockFunction}
      />
    )

    await mockServer.connected
    mockServer.close()

    setTimeout(() => {
      expect(onCloseMockFunction.mock.calls.length).toBe(1)
      wrapper.unmount()
      done()
    }, 110)
  })
})
