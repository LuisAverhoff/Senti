import React, { Component } from "react"
import Paper from "@material-ui/core/Paper"
import IconButton from "@material-ui/core/IconButton"
import SearchIcon from "@material-ui/icons/Search"
import ClearIcon from "@material-ui/icons/Clear"
import Input from "@material-ui/core/Input"
import createStyles from "@material-ui/core/styles/createStyles"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import classNames from "classnames"

const styles = createStyles({
  root: {
    height: 48,
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    "&:focus-within": {
      boxShadow: "0 4px 9px rgba(0,0,0,0.3)"
    },
    "&:hover": {
      boxShadow: "0 4px 9px rgba(0,0,0,0.3)"
    }
  },
  iconButton: {
    transform: "scale(1, 1)",
    transition: "transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)"
  },
  iconButtonDisabled: {
    opacity: 0.38
  },
  icon: {
    transition: "opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)"
  },
  input: {
    width: "100%"
  },
  searchContainer: {
    margin: "auto 16px",
    width: "calc(100% - 80px)"
  }
})

interface SearchBarProps extends WithStyles<typeof styles> {
  /*
   * Name of the custom top-level class.
   */
  className?: string
  /*
   * Disables the search bar.
   */
  disabled?: boolean
  /*
   * Callback when the value changes.
   */
  onChange(value: string): void
  /*
   * Callback when the search icon is clicked or when the search bar has focus and the user
   * presses enter.
   */
  onRequestSearch(query: string): void
  /*
   * Default text to be displayed when value is empty.
   */
  placeholder?: string
  /*
   * Override the default look of the search icon button.
   */
  searchIcon: JSX.Element
  /*
   * Optional style definitions. Default to an empty object
   */
  style?: React.CSSProperties
  /*
   * The value of the text field.
   */
  value: string
}

interface SearchBarState {
  value: string
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  static defaultProps = {
    className: "",
    disabled: false,
    placeholder: "search",
    searchIcon: <SearchIcon style={{ color: "#4483D9" }} />,
    style: {},
    value: ""
  }

  constructor(props: SearchBar["props"]) {
    super(props)
    this.state = {
      value: this.props.value
    }
  }

  handleOnInputBlur = (_e: React.FocusEvent<HTMLDivElement>) => {
    if (this.state.value.trim().length === 0) {
      this.setState({ value: "" })
    }
  }

  handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    this.setState({ value: e.target.value })

    if (this.props.onChange) {
      this.props.onChange(e.target.value)
    }
  }

  handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.charCode === 13 || e.key === "Enter") {
      this.handleSearchRequest()
    }
  }

  handleSearchRequest = () => {
    if (this.props.onRequestSearch) {
      this.props.onRequestSearch(this.state.value)
    }
  }

  render() {
    const { value } = this.state
    const {
      className,
      classes,
      disabled,
      onRequestSearch,
      searchIcon,
      style,
      ...inputProps
    } = this.props

    return (
      <Paper style={style} className={classNames(classes.root, className)}>
        <div className={classes.searchContainer}>
          <Input
            {...inputProps}
            onBlur={this.handleOnInputBlur}
            value={value}
            onChange={this.handleOnChange}
            onKeyUp={this.handleKeyUp}
            fullWidth={true}
            className={classes.input}
            disableUnderline={true}
            disabled={disabled}
          />
        </div>
        <IconButton
          id='searchIconButton'
          onClick={this.handleSearchRequest}
          classes={{
            root: classNames(classes.iconButton),
            disabled: classes.iconButtonDisabled
          }}
          disabled={disabled}
        >
          {React.cloneElement(searchIcon, { classes: { root: classes.icon } })}
        </IconButton>
      </Paper>
    )
  }
}

export default withStyles(styles)(SearchBar)
