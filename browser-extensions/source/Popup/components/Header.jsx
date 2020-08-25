import React from "react"
import browser from "webextension-polyfill"

function openWebPage(url) {
    return browser.tabs.create({url});
}

export default function Header() {
    return (
        <section>
            <div id="header">
            <button id="logo" onClick={() => {openWebPage(SERVER_ENDPOINT)}}>
                <img src={"/static/icons/favicon-32.png"} alt="FowardMail"/>
            </button>
            <span><button id="settings-button" onClick={() => {
                browser.runtime.openOptionsPage()
            }}><clr-icon shape="settings" size="21"></clr-icon></button></span>
            </div>
        </section>
    )
}