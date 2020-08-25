import React from "react"

class AliasTableHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      searchQuery: ""
    };
    this.searchInput = React.createRef()
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this)
    this.handleSearchFormReset = this.handleSearchFormReset.bind(this)
  }

  handleSearchFormReset(_) {
    this.setState({searchQuery: ""})
    this.props.onSearchInputChanged(event.target.value)
  }

  handleSearchInputChange(event) {
    this.setState({searchQuery: event.target.value})
    this.props.onSearchInputChanged(event.target.value)
  }
  
  componentDidUpdate() {
    if (this.searchInput.current) {
      this.searchInput.current.focus()
    }
  }

  render() {
   
    return (
      <div id="table-header" style={{background: this.state.isSearching ? "#FDFDFD" : "none"}}>
        <span id="user-info" style={{display: this.state.isSearching ? "none" : ""}}>
          <h5 style={{marginBottom: "4px"}}>Aliases</h5>
          <p id="user-email" style={{margin: "0px"}}>{this.props.user ? this.props.user.email : ""}</p>
        </span>
          <form id="search-form" onReset={this.handleSearchFormReset}></form>
        <span>
          <input rel={this.searchInput} form="search-form" type="text" style={{display: this.state.isSearching ? "" : "none"}} id="search-input" placeholder="Search..." value={this.state.searchQuery} onChange={this.handleSearchInputChange}/>
        </span>
        <span style={{marginTop: "10px", marginRight: "40px"}}>
          <button id="search-button" onClick={() => {
            
            this.setState({searchQuery: "", isSearching: !this.state.isSearching})
            this.props.onSearchInputChanged("")
            
          }}><clr-icon shape={this.state.isSearching ? "close" : "search"} size="21"></clr-icon></button>
        </span>
      </div>
    )
  }
}

export default AliasTableHeader
