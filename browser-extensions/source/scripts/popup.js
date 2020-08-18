import browser from 'webextension-polyfill';
import {APICall} from './utilities'

let aliases = []

document.getElementById("sign-in").addEventListener('click', handleSignIn)

async function handleSignIn() {
  let email = document.getElementById("auth-email").value
  let password = document.getElementById("auth-password").value

  let data = {
    username: email,
    password
  }
  let json = await APICall("token", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  let token = json.token

  if (token) {
    browser.storage.sync.set({token})
    document.dispatchEvent(new Event("DOMContentLoaded"))
  } else {
    // TODO: Show error
  }
}

function preventDefault(e) {
  e.preventDefault()
}

document.addEventListener('DOMContentLoaded', handlPageLoad)

async function handlPageLoad() {
  
  Array.from(document.querySelectorAll("form")).forEach(form => {
    form.addEventListener("submit", preventDefault)
  })

  let token = await browser.storage.sync.get("token")
  if ("token" in token) {
    document.getElementById("auth").style.display = "none"
    document.getElementById("popup").style.display = ""
  } else {
    document.getElementById("auth").style.display = ""
    document.getElementById("popup").style.display = "none"
    return
  }

  let activeTab = (await browser.tabs.query({active: true}))[0]
  let activeDomain = activeTab.title 
  
  try {
    activeDomain = activeTab.url.split("://")[1].split("/")[0]
  } catch (error) {
    console.log("Using title")
  }
  
  document.getElementById("new-alias-name").value = activeDomain

  aliases = await APICall("aliases", {
    method: "GET"
  })

  // TODO: Add search
  // if (aliases.length == 0) {
  //   document.getElementById("alias-search").style.display = "none"
  // }

  let listElement = document.getElementById("alias-container")
  listElement.innerHTML = ""
  aliases.forEach(alias => {
    let elementHTML = [`<li data-id="${alias.id}"><span class="alias-name">${alias.name}</span>`,
    `<span class="alias-actions">`,
    `<button class="alias-copy" title="Copy address"><clr-icon shape="copy" size="21"></clr-icon></button>`,
    `<button class="alias-disconnect" title="${alias.is_disconnected ? 'Reconnect' : 'Disconnect'}"><clr-icon shape="${alias.is_disconnected ? 'connect' : 'disconnect'}" size="21"></clr-icon></button>`,
    `<button class="alias-delete" title="Remove"><clr-icon shape="trash" size="21"></clr-icon></button>`,
    `</span>`,
    `<span class="alias-address">${alias.proxy_address}</span></li>`].join("")
    listElement.innerHTML = elementHTML + listElement.innerHTML
  })

  Array.from(document.querySelectorAll("#alias-section li")).forEach(e => {
    e.addEventListener("click", () => {
      window.navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
          var span =  e.querySelector(".alias-address")
          window.navigator.clipboard.writeText(span.textContent)
          // TODO: Display "Copied tooltip"
        }
      });
    })

    let aliasID = e.dataset.id
    Array.from(["copy", "disconnect", "delete"]).forEach(action => {
      e.querySelector(`.alias-${action}`).addEventListener("click", () => {
        aliasAction(action, aliasID)
      })
    })
  })

  
  document.getElementById("new-alias-create").addEventListener("click", handleCreateAlias)

  document.getElementById("settings-button").addEventListener("click", async () => {
    browser.runtime.openOptionsPage()
  })
}

async function handleCreateAlias() {
  let nameElement = document.getElementById("new-alias-name")
  // TODO: Disable button when busy
  if (nameElement.value.length > 0) {
    await APICall("aliases", {
      method: "POST",
      body: JSON.stringify({alias_name: nameElement.value})
    })
    nameElement.value = ""
    document.dispatchEvent(new Event("DOMContentLoaded"))
  }
}

async function aliasAction(method, id) {
  let alias = aliases.find(e => e.id == id)
  if (method == "copy") {
    window.navigator.permissions.query({name: "clipboard-write"}).then(result => {
      if (result.state == "granted" || result.state == "prompt") {
        window.navigator.clipboard.writeText(alias.proxy_address)
        // TODO: Display "Copied tooltip"
      }
    });
  } else if (method == "disconnect" || method == "delete") {
    await APICall(`aliases/${id}/${method}`, {
      method: "POST"
    })
    document.dispatchEvent(new Event("DOMContentLoaded"))
  }
}