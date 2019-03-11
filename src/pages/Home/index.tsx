import React, { Component } from 'react'
import Image from 'react-simple-image'
import { RouteComponentProps } from 'react-router'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'
import SearchBar from '../../components/Search'
import { LogoSmall, LogoMedium, LogoLarge } from '../../assets/images/Logo'

const styles = createStyles({
  container: {
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40
  },
  row: {
    width: '50%',
    flexDirection: 'row',
    marginTop: 15
  }
})

interface HomeState {
  query: string
}

interface HomeProps extends WithStyles<typeof styles>, RouteComponentProps<{}> {}

class HomePage extends Component<HomeProps, HomeState> {
  state = {
    query: ''
  }

  HandleSearchRequest(query: string) {
    if (query) {
      this.props.history.push(`/search/${query}`)
    }
  }

  render() {
    const { query } = this.state
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <div className={classes.logoContainer}>
          <Image
            src={LogoSmall}
            alt="Logo"
            srcSet={{
              '200w': LogoSmall,
              '300w': LogoMedium,
              '578w': LogoLarge
            }}
            sizes={[
              { size: '50vw', mediaCondition: '(max-width: 30em)' },
              { size: '30vw', mediaCondition: '(max-width: 50em)' },
              { size: '18vw', mediaCondition: '(max-width: 100em)' }
            ]}
          />
        </div>
        <div className={classes.row}>
          <SearchBar
            value={query}
            onChange={newValue => this.setState({ query: newValue })}
            onRequestSearch={() => this.HandleSearchRequest(query)}
            style={{
              margin: '0 auto',
              maxWidth: '100%',
              minWidth: '25%'
            }}
          />
        </div>
      </div>
    )
  }
}

const Home = withStyles(styles)(HomePage)

export { Home }
