import React from "react"
import browser from "webextension-polyfill"
import AliasTableHeader from "./AliasTableHeader"
import AliasElement from "./AliasElement"
import {refreshAliases, APICall} from "../../service"

class AliasTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {aliases: [], filteredAliases: [], searchQuery: "", tabDomain: ""}

    this.handleAliasAction = this.handleAliasAction.bind(this)
    this.handleStorageChange = this.handleStorageChange.bind(this)
    this.handleSearchFormChange = this.handleSearchFormChange.bind(this)
  }

  async handleAliasAction(id, action) {
    console.log(id, action)
    let alias = this.state.aliases.find(e => e.id == id)
    if (action == "copy") {
      window.navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
            window.navigator.clipboard.writeText(alias.proxy_address)
            // TODO: Display "Copied tooltip"
        }
      });
    } else if (action == "disconnect" || action == "delete") {
      if (action == "delete") {
        if (!confirm("Are you sure you would like to permanently delete this alias? This action cannot be undone.")) {
            return
        }
      }
      await APICall(`aliases/${id}/${action}`, {
        method: "POST"
      })
      refreshAliases()
    }
  }

  handleStorageChange(changes) {
    console.log(changes)
      if (changes && "aliases" in changes) {
        this.setState({aliases: changes.aliases.newValue})
        this.handleSearchFormChange()
      }
  }

  componentDidUpdate() {
    if (this.props.tabDomain != this.state.tabDomain) {
      this.setState({tabDomain: this.props.tabDomain})
      this.handleSearchFormChange()
    }
  }

  async componentDidMount() {
    if (!browser.storage.onChanged.hasListener(this.handleStorageChange)) {
      browser.storage.onChanged.addListener(this.handleStorageChange)
    }
    let aliases = (await browser.storage.sync.get("aliases")).aliases || []
    this.setState({aliases})
    this.handleSearchFormChange()
    
    refreshAliases()
  }

  handleSearchFormChange(query) {
    query = query != null ?  query : this.state.searchQuery
    let sortedAliases = this.state.aliases
    let activeDomain = this.props.tabDomain
    sortedAliases = sortedAliases.sort((a, b) => {
      let aInDomain = Math.max(activeDomain.toLowerCase().indexOf(a.name.toLowerCase()), a.name.toLowerCase().indexOf(activeDomain.toLowerCase())) >= 0
      let bInDomain = Math.max(activeDomain.toLowerCase().indexOf(b.name.toLowerCase()), b.name.toLowerCase().indexOf(activeDomain.toLowerCase())) >= 0
      if (aInDomain && bInDomain) {
        return 0
      } else if (aInDomain) {
        return -1
      } else {
        return 1
      }
    })
    console.log(query)
    this.setState({
      searchQuery: query,
      filteredAliases: sortedAliases.filter(alias => {
        return alias.proxy_address.toLowerCase().indexOf(query.toLowerCase()) > -1 || 
          alias.name.toLowerCase().indexOf(query.toLowerCase()) > -1
      })
    })
  }

  render() {
    let aliasElements = this.state.filteredAliases.map(alias => 
      <AliasElement key={alias.id} alias={alias} actionHandler={this.handleAliasAction} />
    )
    return (
      <div>
        <AliasTableHeader user={this.props.user} onSearchInputChanged={this.handleSearchFormChange}/>
        <div id="alias-section">
          <ul id="alias-container" className="">
            {aliasElements}
          </ul>
        </div>
      </div>
    )
  }
}

export default AliasTable

