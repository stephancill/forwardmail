import React from "react";
import browser from "webextension-polyfill";
import {refreshAliases, createNewAlias} from "./../../service"
import "./../../styles/spinkit.min.css"

class NewAliasForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      aliasName: "",
      isBusy: false,
      tabDomain: false,
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidUpdate() {
    if (this.state.tabDomain != this.props.tabDomain) {
      this.setState({aliasName: this.props.tabDomain, tabDomain: this.props.tabDomain})  
    }
  }

  handleInputChange(event) {
    this.setState({aliasName: event.target.value})
  }

  async handleSubmit(event) {
    event.preventDefault()
    this.setState({isBusy: true})
    await createNewAlias(this.state.aliasName)
    this.setState({aliasName: ""})
    await refreshAliases()
    this.setState({isBusy: false})
  }

  render() {
    let buttonContent = this.state.isBusy ? (
      <div className="sk-chase" style={{margin: "5px", height: "18px", width: "18px"}}>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
      </div>
    ) : (
      <span>+</span>
    )
    return (
      <form id="new-alias-form" onSubmit={this.handleSubmit}>
        <input id="new-alias-name" type="text" value={this.state.aliasName}  onChange={this.handleInputChange} required/>
        <button type="submit" id="new-alias-create" className={"btn-primary"} disabled={this.state.isBusy}>
          {buttonContent}
        </button>
      </form>
    )
  }
}

export default NewAliasForm