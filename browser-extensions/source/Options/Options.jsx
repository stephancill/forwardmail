import React from "react";
import {getUser, refreshUser, logout} from "./../service"
import browser from "webextension-polyfill"

class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: false};

    this.handleStorageChange = this.handleStorageChange.bind(this)
  }

  handleStorageChange(changes) {
    if ("user" in changes) {
        this.setState({user: changes.user.newValue})
    }
  }

  async componentDidMount() {
    if (!browser.storage.onChanged.hasListener(this.handleStorageChange)) {
        browser.storage.onChanged.addListener(this.handleStorageChange)
    }

    let user = await getUser()
    this.setState({user: user})
    refreshUser()
  }

  render() {
    let options = this.state.user ? (
      <div className={"mb-3"}>
        <div>
          <p style={{fontSize: "18px"}}>{this.state.user.email}</p> 
        </div>
        <div className={"options-container"}>
          <button className={"cta-button"} type="submit" style={{fontSize: "14px"}} onClick={() => {
            logout()
          }}>Logout</button>
        </div>
      </div>
    ) : (
      <p style={{fontSize: "18px"}}>Please use the extension to sign in.</p>
    )
    return (
      <section>
        <div className={"form-container card"} style={{marginRight: "auto", marginLeft: "auto"}}>
          <h3 className={"mb-3"}>ForwardMail Extension</h3>
          {options}
        </div>
      </section>
    )
  }
}

export default Options;
