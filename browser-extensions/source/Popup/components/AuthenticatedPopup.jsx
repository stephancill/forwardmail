import React from "react";
import browser from "webextension-polyfill";
import NewAliasForm from "./NewAliasForm"
import AliasTable from "./AliasTable"
import {getUser, refreshUser} from "../../service"

class AuthenticatedPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: false, tabDomain: ""};

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
    
    let activeTab = (await browser.tabs.query({active: true}))[0]
    let activeDomain = activeTab.title 
    try {
      activeDomain = activeTab.url.split("://")[1].split("/")[0]
    } catch (error) {}
    
    this.setState({user, tabDomain: activeDomain})
    
    refreshUser()
  }

  render() {
    console.log(this.state.tabDomain)
    return (
      <section id="popup">
        <NewAliasForm tabDomain={this.state.tabDomain}/>
        <AliasTable user={this.state.user} tabDomain={this.state.tabDomain} />
      </section>
    )
  }
  
}

export default AuthenticatedPopup

