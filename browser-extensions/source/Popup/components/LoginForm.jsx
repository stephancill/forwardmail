import React from "react";
import browser from "webextension-polyfill";
import {APICall} from "./../../service"

class LoginForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: "",
      password: "",
      isLoading: false,
    }

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value})
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value})
  }

  async handleSubmit(event) {
    event.preventDefault()
    this.setState({isLoading: true})
    let json = await APICall("token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username: this.state.email, password: this.state.password})
    })
    let token = json.token
    if (token) {
      await browser.storage.sync.set({token})
    } else {
      // TODO: Show error
    }
    this.setState({isLoading: false})
    
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input id="auth-email" type="text" placeholder="Email" onChange={this.handleEmailChange} required/>
        <input id="auth-password" type="password" placeholder="Password" onChange={this.handlePasswordChange} required/>
        <button id="sign-in" className="cta-button" type="submit" disabled={this.state.isLoading}>Sign in</button>
      </form>
    )
  }
}

export default LoginForm