import React, { Component } from "react"
import Image from "react-simple-image"
import { ChartData } from "chart.js"
import { RouteComponentProps } from "react-router"
import createStyles from "@material-ui/core/styles/createStyles"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton"
import Grid from "@material-ui/core/Grid"
import SearchBar from "../../components/Search"
import ReactWebsocket from "../../components/Socket"
import { Chart } from "../../components/Chart"
import { LogoSmall, LogoMedium, LogoLarge } from "../../assets/images/Logo"
import { PieChartSkeleton, BarChartSkeleton } from "../../util/skeletons"
import MaxHeap from "../../util/maxheap"

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
    marginTop: 8,
    width: "40%"
  },
  chartContainer: {
    justifyContent: "center",
    alignContent: "center",
    flexGrow: 1
  }
})

interface RouterProps {
  query: string
}

interface SearchState {
  query: string
  piedata: ChartData
  bardata: ChartData
}

interface SearchProps
  extends WithStyles<typeof styles>,
    RouteComponentProps<RouterProps> {}

class SearchPage extends Component<SearchProps, SearchState> {
  private webSocketRef = React.createRef<ReactWebsocket>()
  private hashtags: HashTagFreq = {}

  constructor(props: SearchPage["props"]) {
    super(props)

    this.state = {
      query: this.props.match.params.query,
      piedata: {
        labels: ["Positive", "Negative", "Neutral"],
        datasets: [
          {
            data: [],
            backgroundColor: ["#4CAF50", "#F44336", "#9E9E9E"],
            hoverBackgroundColor: ["#2E7D32", "#C62828", "#616161"],
            borderColor: "#FFF"
          }
        ]
      },
      bardata: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              "#2962FF",
              "#FFEE58",
              "#FF7043",
              "#7E57C2",
              "#F44336"
            ],
            hoverBackgroundColor: [
              "#01579B",
              "#F9A825",
              "#BF360C",
              "#4527A0",
              "#B71C1C"
            ]
          }
        ]
      }
    }
  }

  componentDidMount() {
    const { query } = this.props.match.params

    if (this.webSocketRef.current) {
      this.webSocketRef.current.sendMessage({ track: query })
    }
  }

  handleMessage = (message: any) => {
    this.updatePieChart(message)
    this.updateBarChart(message)
  }

  updatePieChart = (message: any) => {
    let polarity = message.polarityIndex

    this.setState(state => {
      const data =
        state.piedata.datasets![0].data!.length === 0
          ? [0, 0, 0]
          : (state.piedata.datasets![0].data!.slice() as number[])
      // Numbers are immutable objects, so you can just clone the array and replace the element.
      data[polarity] += 1

      return {
        piedata: {
          ...state.piedata,
          datasets: [
            {
              ...state.piedata.datasets![0],
              data
            }
          ]
        }
      }
    })
  }

  updateBarChart(message: any) {
    if (Object.keys(message.hashtags).length == 0) {
      return
    }

    Object.keys(message.hashtags).forEach(item => {
      if (item in this.hashtags) {
        this.hashtags[item] += message.hashtags[item]
      } else {
        this.hashtags[item] = message.hashtags[item]
      }
    })

    let labels = Object.keys(this.hashtags)
    let data = Object.values(this.hashtags)

    if (labels.length > 5) {
      const topFiveHashTags = this.getKLargestHashtags(5, this.hashtags)
      labels = Object.keys(topFiveHashTags)
      data = Object.values(topFiveHashTags)
    }

    this.setState(state => {
      return {
        bardata: {
          ...state.bardata,
          labels,
          datasets: [
            {
              ...state.bardata.datasets![0],
              data
            }
          ]
        }
      }
    })
  }

  resetCharts = () => {
    this.setState(state => {
      return {
        piedata: {
          ...state.piedata,
          datasets: [
            {
              ...state.piedata.datasets![0],
              data: []
            }
          ]
        },
        bardata: {
          ...state.bardata,
          labels: [],
          datasets: [
            {
              ...state.bardata.datasets![0],
              data: []
            }
          ]
        }
      }
    })
  }

  HandleSearchRequest(query: string) {
    if (query) {
      if (this.webSocketRef.current) {
        this.webSocketRef.current.sendMessage({ track: query })
      }

      this.resetCharts()

      this.props.history.push(`/search/${query}`)
    }
  }

  getKLargestHashtags = (k: number, hashtags: HashTagFreq) => {
    const heap = new MaxHeap()

    Object.keys(hashtags).forEach(item => {
      heap.insert(item, hashtags[item])
    })

    const topFiveHashTags: HashTagFreq = {}

    let index = 0

    while (index < k) {
      const node = heap.extractMax()
      topFiveHashTags[node!.key] = node!.value
      index++
    }

    return topFiveHashTags
  }

  returnToHomePage() {
    this.props.history.push("/")
  }

  render() {
    const { classes } = this.props
    const { query, piedata, bardata } = this.state
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
                "200w": LogoSmall,
                "300w": LogoMedium,
                "578w": LogoLarge
              }}
              sizes={[
                { size: "20vw", mediaCondition: "(max-width: 30em)" },
                { size: "15vw", mediaCondition: "(max-width: 50em)" },
                { size: "10vw" }
              ]}
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
        <Grid className={classes.chartContainer} container={true} spacing={0}>
          <Grid item={true} xs={12} sm={6}>
            <Chart
              data={piedata}
              type='pie'
              skeleton={PieChartSkeleton}
              width={800}
              height={600}
              options={{
                responsive: true,
                legend: {
                  display: true,
                  position: "bottom",
                  fullWidth: true,
                  reverse: false
                },
                title: {
                  display: true,
                  fontSize: 24,
                  fullWidth: true,
                  text: "Polarity of " + queryParam
                },
                plugins: {
                  labels: {
                    render: "percentage",
                    fontSize: 24,
                    fontColor: "white",
                    precision: 0
                  }
                }
              }}
            />
          </Grid>
          <Grid item={true} xs={12} sm={6}>
            <Chart
              data={bardata}
              type='bar'
              skeleton={BarChartSkeleton}
              width={800}
              height={600}
              options={{
                responsive: true,
                legend: {
                  display: false
                },
                title: {
                  display: true,
                  fontSize: 24,
                  fullWidth: true,
                  text:
                    "Top 5 Hashtags People Associate with the the Word " +
                    queryParam
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        callback: function(value) {
                          if (value % 1 === 0) {
                            return value
                          }
                        }
                      }
                    }
                  ]
                },
                plugins: {
                  labels: false
                }
              }}
            />
          </Grid>
        </Grid>
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
