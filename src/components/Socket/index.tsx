import { Component } from 'react'

interface ReactWebsocketProps {
  /*
   * The url the websocket connection is listening to.
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
  timestamp: number
  attempts: number
  messageQueue: Array<Message>
}

class ReactWebsocket extends Component<ReactWebsocketProps, ReactWebsocketState> {
  private timerHandle: number = 0

  static defaultProps = {
    debug: false,
    autoReconnect: true
  }

  constructor(props: ReactWebsocket['props']) {
    super(props)

    this.state = {
      ws: new WebSocket(this.props.url, this.props.protocols),
      timestamp: -1,
      attempts: 2,
      messageQueue: []
    }
  }

  componentDidMount() {
    this._addListeners()
  }

  componentWillUnmount() {
    const { ws } = this.state

    this._clearTimer()
    this._removeListeners()
    ws.close()
  }

  shouldComponentUpdate(_nextProps: ReactWebsocketProps, _nextState: ReactWebsocketState) {
    return false
  }

  _addListeners = () => {
    const { ws } = this.state

    if (!ws) {
      return
    }

    this._debugLine('Adding event listeners')

    ws.addEventListener('open', this._handleOpen)
    ws.addEventListener('error', this._handleError)
    ws.addEventListener('message', this._handleMessage)
    ws.addEventListener('close', this._handleClose)
  }

  _removeListeners = () => {
    const { ws } = this.state

    if (!ws) {
      return
    }

    this._debugLine('removing event listeners')

    ws.removeEventListener('open', this._handleOpen)
    ws.removeEventListener('error', this._handleError)
    ws.removeEventListener('message', this._handleMessage)
    ws.removeEventListener('close', this._handleClose)
  }

  _handleOpen = (evt: Event) => {
    const { ws, messageQueue } = this.state

    this._debugLine('The Websocket has successfully established a connection to the websocket server.')
    this.setState({ attempts: 2 }) // This line is so that reconnecting resets the retry cooloff.

    if (this.props.onOpen) {
      this.props.onOpen(evt)
    }

    while (messageQueue.length > 0) {
      const message = messageQueue.pop()
      this._debugLine('Dequeuing message', message)
      ws.send(message!) // This postfix operator is useful because we know message can never be undefined.
    }
  }

  _handleError = (evt: Event) => {
    if (this.props.onError) {
      this.props.onError(evt)
    }
  }

  _handleMessage = (evt: MessageEvent) => {
    try {
      this._debugLine(`Message received from the websocket server: ${evt.data}`)
      this.setState({ timestamp: Date.now() })
      this.props.onMessage(JSON.parse(evt.data))
    } catch (err) {
      this._debugLine(err)
    }
  }

  _handleClose = (evt: CloseEvent) => {
    this._debugLine(
      `The Websocket client has closed the connection to the websocket server. Code: ${evt.code}, Reason: ${evt.reason}`
    )

    if (this.props.onClose) {
      this.props.onClose(evt.code, evt.reason)
    }

    if (this.props.autoReconnect) {
      this._debugLine('Attempting to reestablish connection to the websocket server.')
      this._reconnect()
    }
  }

  _debugLine = (...args: any[]) => {
    if (this.props.debug) {
      console.log(...args)
    }
  }

  _generateInterval = (k: number) => {
    const { reconnectIntervalInMilliSeconds } = this.props

    if (reconnectIntervalInMilliSeconds && reconnectIntervalInMilliSeconds > 0) {
      return reconnectIntervalInMilliSeconds
    }

    /*
     * This formula is an example of an exponential backoff strategy that spaces out retransmissions
     * to reduce network congestions.
     */

    return Math.min(30, Math.pow(2, k) - 1) * 1000
  }

  _reconnect = () => {
    this._clearTimer()

    const time = this._generateInterval(this.state.attempts)

    this.timerHandle = window.setTimeout(() => {
      this._resetWebsocket()
      this._removeListeners()
      this._addListeners()
    }, time)
  }

  _resetWebsocket = () => {
    this.setState({ attempts: this.state.attempts + 1 })
    this.setState({ timestamp: -1 })
    this.setState({ ws: new WebSocket(this.props.url, this.props.protocols) })
  }

  _clearTimer = () => {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle)
      this.timerHandle = 0
    }
  }

  sendMessage = (message: any) => {
    const { ws, messageQueue } = this.state

    const body = { message: message, timestamp: Date.now() }

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(body))
    } else {
      this._debugLine('Enqueuing message', body)
      messageQueue.push(JSON.stringify(body))
    }
  }

  render() {
    return null
  }
}

export default ReactWebsocket
