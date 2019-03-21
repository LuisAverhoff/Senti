import React, { Component } from "react"
import Image from "react-simple-image"
import { RouteComponentProps } from "react-router"
import createStyles from "@material-ui/core/styles/createStyles"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton"
import SearchBar from "../../components/Search"
import ReactWebsocket from "../../components/Socket"
import { LineChart } from "../../components/Charts"
import { LogoSmall, LogoMedium, LogoLarge } from "../../assets/images/Logo"

const styles = createStyles({
  container: {
    height: "100vh",
    flexDirection: "column",
    display: "flex"
  },
  header: {
    maxHeight: "10%",
    minHeight: "10%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 5
  },
  logo: {
    backgroundColor: "transparent",
    marginRight: 50,
    "&:hover": {
      backgroundColor: "transparent" // Remove the gray color that appears when you hover over the logo.
    }
  },
  searchBar: {
    marginTop: 15,
    width: "40%"
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex"
  },
  chart: {
    marginRight: 50,
    width: "65%"
  }
})

interface RouterProps {
  query: string
}

interface SearchState {
  query: string
  data: Chart.ChartData
}

interface SearchProps
  extends WithStyles<typeof styles>,
    RouteComponentProps<RouterProps> {}

class SearchPage extends Component<SearchProps, SearchState> {
  private webSocketRef = React.createRef<ReactWebsocket>()

  constructor(props: SearchPage["props"]) {
    super(props)

    this.state = {
      query: this.props.match.params.query,
      data: { labels: [], datasets: [{ data: [] }] }
    }
  }

  componentDidMount() {
    const { query } = this.props.match.params

    if (this.webSocketRef.current) {
      this.webSocketRef.current.sendMessage({ track: query })
    }
  }

  handleMessage = (message: any) => {
    const { data } = this.state

    this.setState({
      data: {
        labels: [...this.state.data.labels!, message["created_at"]],
        datasets: [
          { data: [...this.state.data.datasets![0].data!, message["polarity"]] }
        ]
      }
    })
  }

  HandleSearchRequest(query: string) {
    if (query) {
      if (this.webSocketRef.current) {
        this.webSocketRef.current.sendMessage({ track: query })
      }

      this.props.history.push(`/search/${query}`)
    }
  }

  returnToHomePage() {
    this.props.history.push("/")
  }

  render() {
    const { classes } = this.props
    const { query, data } = this.state
    const queryParam = this.props.match.params.query

    return (
      <div className={classes.container}>
        <div className={classes.header}>
          <IconButton
            disableRipple={true}
            className={classes.logo}
            onClick={() => this.returnToHomePage()}
          >
            <Image
              src={LogoSmall}
              alt='Logo'
              srcSet={{
                "1x": LogoSmall,
                "2x": LogoMedium,
                "3x": LogoLarge
              }}
            />
          </IconButton>
          <div className={classes.searchBar}>
            <SearchBar
              value={query}
              onChange={newValue => this.setState({ query: newValue })}
              onRequestSearch={() => this.HandleSearchRequest(query)}
              style={{
                borderRadius: 30
              }}
            />
          </div>
        </div>
        <Divider />
        <div className={classes.chartContainer}>
          <div className={classes.chart}>
            <LineChart
              data={data}
              width={800}
              height={600}
              options={{
                maintainAspectRatio: false,
                legend: { display: false },
                elements: { line: { fill: false } },
                title: {
                  display: true,
                  fontSize: 24,
                  fullWidth: true,
                  text: "Polarity of " + queryParam + " Over Time"
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        min: -1,
                        max: 1,
                        stepSize: 0.1
                      }
                    }
                  ]
                }
              }}
            />
            )
          </div>
        </div>
        <ReactWebsocket
          url={process.env.REACT_APP_WEBSOCKET_URL}
          onMessage={this.handleMessage}
          autoReconnect={true}
          debug={process.env.NODE_ENV === "development" ? true : false}
          ref={this.webSocketRef}
        />
      </div>
    )
  }
}

const Search = withStyles(styles)(SearchPage)

export { Search }
