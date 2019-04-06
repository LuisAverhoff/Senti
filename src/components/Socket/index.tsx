import { Component } from "react"

interface ReactWebsocketProps {
  /*
   * The url the websocket connection is listening to.
   * Defaults to ws://localhost:8000 if an invalid url was provided.
   */
  url: string
  /*
   * The name of the sub-protocol the server selected
   */
  protocols?: string | string[]
  /*
   * Enable this in development to see what the console is logging.
   */
  debug?: boolean
  /*
   * Enable this to initiate a accelerated reconnection strategy upon disconnect.
   */
  autoReconnect?: boolean
  /*
   * How long the component waits before it attempts to reconnect.
   */
  reconnectIntervalInMilliSeconds?: number
  /*
   * The callback that is called when the data is received.
   */
  onMessage(data: any): void
  /*
   * The callback that is called when the connection is successfully opened.
   */
  onOpen?(evt: Event): void
  /*
   * The callback that is called when the connection is closed either due to server disconnect or network error.
   */
  onClose?(code?: number, reason?: string): void
  /*
   * The callback that is called when an error occurs.
   */
  onError?(evt: Event): void
}

type Message = string | ArrayBuffer | Blob | ArrayBufferView

interface ReactWebsocketState {
  ws: WebSocket
  attempts: number
  messageQueue: Array<Message>
}

class ReactWebsocket extends Component<
  ReactWebsocketProps,
  ReactWebsocketState
> {
  private timerHandle: number = 0

  static defaultProps = {
    debug: false,
    autoReconnect: true,
    url: "ws://localhost:8000"
  }

  constructor(props: ReactWebsocket["props"]) {
    super(props)

    this.state = {
      ws: new WebSocket(this.props.url, this.props.protocols),
      attempts: 1,
      messageQueue: []
    }
  }

  componentDidMount() {
    this.addListeners()
  }

  componentWillUnmount() {
    const { ws } = this.state

    this.clearTimer()
    this.removeListeners()
    ws.close()
  }

  shouldComponentUpdate(
    _nextProps: ReactWebsocketProps,
    _nextState: ReactWebsocketState
  ) {
    return false
  }

  private addListeners = () => {
    const { ws } = this.state

    if (!ws) {
      return
    }

    this.debugLine("Adding event listeners")

    ws.addEventListener("open", this.handleOpen)
    ws.addEventListener("error", this.handleError)
    ws.addEventListener("message", this.handleMessage)
    ws.addEventListener("close", this.handleClose)
  }

  private removeListeners = () => {
    const { ws } = this.state

    if (!ws) {
      return
    }

    this.debugLine("removing event listeners")

    ws.removeEventListener("open", this.handleOpen)
    ws.removeEventListener("error", this.handleError)
    ws.removeEventListener("message", this.handleMessage)
    ws.removeEventListener("close", this.handleClose)
  }

  private handleOpen = (evt: Event) => {
    const { ws, messageQueue } = this.state

    this.debugLine(
      "The Websocket has successfully established a connection to the websocket server."
    )
    this.setState({ attempts: 1 }) // This line is so that reconnecting resets the retry cooloff.

    if (this.props.onOpen) {
      this.props.onOpen(evt)
    }

    while (messageQueue.length > 0) {
      const message = messageQueue.pop()
      this.debugLine("Dequeuing message", message)
      // This postfix operator is useful because we know message can never be undefined.
      ws.send(message!)
    }
  }

  private handleError = (evt: Event) => {
    if (this.props.onError) {
      this.props.onError(evt)
    }
  }

  private handleMessage = (evt: MessageEvent) => {
    try {
      this.debugLine(`Message received from the websocket server: ${evt.data}`)
      this.props.onMessage(JSON.parse(evt.data))
    } catch (err) {
      this.debugLine(err)
    }
  }

  private handleClose = (evt: CloseEvent) => {
    this.debugLine(
      `The Websocket client has closed the connection to the websocket server. Code: ${
        evt.code
      }, Reason: ${evt.reason}`
    )

    if (this.props.onClose) {
      this.props.onClose(evt.code, evt.reason)
    }

    if (this.props.autoReconnect) {
      this.debugLine(
        "Attempting to reestablish connection to the websocket server."
      )
      this.retryToConnect()
    }
  }

  private debugLine = (...args: any[]) => {
    if (this.props.debug) {
      console.log(...args)
    }
  }

  private generateInterval = (k: number) => {
    const { reconnectIntervalInMilliSeconds } = this.props

    if (
      reconnectIntervalInMilliSeconds &&
      reconnectIntervalInMilliSeconds > 0
    ) {
      return reconnectIntervalInMilliSeconds
    }

    /*
     * This formula is an example of an exponential backoff strategy that spaces out retransmissions
     * to reduce network congestions.
     */

    return Math.min(30, Math.pow(2, k) - 1) * 1000
  }

  private retryToConnect = () => {
    const { attempts } = this.state
    this.clearTimer()

    const time = this.generateInterval(attempts)

    this.timerHandle = window.setTimeout(() => {
      this.setState({ attempts: attempts + 1 })
      this.reconnect()
    }, time)
  }

  reconnect = () => {
    this.removeListeners()
    this.setState({ ws: new WebSocket(this.props.url, this.props.protocols) })
    this.addListeners()
  }

  private clearTimer = () => {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle)
      this.timerHandle = 0
    }
  }

  sendMessage = (message: any) => {
    const { ws, messageQueue } = this.state

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    } else {
      this.debugLine("Enqueuing message", message)
      messageQueue.push(JSON.stringify(message))
    }
  }

  render() {
    return null
  }
}

export default ReactWebsocket
