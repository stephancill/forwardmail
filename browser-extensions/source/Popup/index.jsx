import React from "react"
import ReactDOM from "react-dom"
import AuthenticatedPopup from "./components/AuthenticatedPopup"
import UnauthenticatedPopup from "./components/UnauthenticatedPopup";
import Header from "./components/Header"
import browser from "webextension-polyfill"
import "./popup.css"

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoggedIn: false};

        this.handleStorageChange = this.handleStorageChange.bind(this)
    }

    handleStorageChange(changes) {
        if ("token" in changes) {
            this.setState({
                isLoggedIn: changes.token.newValue
            })
        }
    }

    async componentDidMount() {
        if (!browser.storage.onChanged.hasListener(this.handleStorageChange)) {
            browser.storage.onChanged.addListener(this.handleStorageChange)
        }
        let token = await browser.storage.sync.get("token")
        
        this.setState({
            isLoggedIn: "token" in token && token.token
        })
    }
  
    render() {
        const isLoggedIn = this.state.isLoggedIn;
        let app;
        if (isLoggedIn) {
            app = <AuthenticatedPopup />
        } 
        else {
            app = <UnauthenticatedPopup />
        }
        return (
            <div>
            <Header/>
            {app}
            </div>
        );
    }
}

ReactDOM.render(<Popup/>, document.getElementById("popup-root"));
