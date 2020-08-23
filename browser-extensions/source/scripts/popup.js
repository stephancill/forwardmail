import browser from 'webextension-polyfill';
import {APICall} from './utilities'

let aliases = []

function openWebpage(url) {
  browser.tabs.create({url})
}

function openForwardMailWebsite() {
  openWebpage(SERVER_ENDPOINT)
}

function searchButtonPressed() {
  let userInfo = document.getElementById("user-info")
  let searchInput = document.getElementById("search-input")
  let searchButton = document.getElementById("search-button")
  let dismissSearchButton = document.getElementById("dismiss-search-button")

  let aliasContainer = document.getElementById("alias-container")
  let tableHeader = document.getElementById("table-header")

  Array.from([userInfo, searchInput, searchButton, dismissSearchButton]).forEach(e => {
    e.style.display = e.style.display == "none" ? "inline" : "none";
  })

  if (tableHeader.classList.contains("drop-shadow-up")) {
    tableHeader.classList.remove("drop-shadow-up")
    aliasContainer.classList.add("drop-shadow-up")
  } else {
    aliasContainer.classList.remove("drop-shadow-up")
    tableHeader.classList.add("drop-shadow-up")
  }
}

document.getElementById("logo").addEventListener('click', openForwardMailWebsite)
document.getElementById("sign-in").addEventListener('click', handleSignIn)
document.getElementById("search-button").addEventListener('click', searchButtonPressed)
document.getElementById("dismiss-search-button").addEventListener('click', searchButtonPressed)
document.getElementById("search-input").addEventListener('input', onSearchInputChange)
document.getElementById("search-form").addEventListener('reset', onSearchReset)

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
    await browser.storage.sync.set({token})
    let user = await APICall("self", {
      method: "GET"
    })
    await browser.storage.sync.set({user})
    document.dispatchEvent(new Event("DOMContentLoaded"))
  } else {
    // TODO: Show error
  }
}

function preventDefault(e) {
  e.preventDefault()
}

document.addEventListener('DOMContentLoaded', handlePageLoad)

async function handlePageLoad() {
  console.log(SERVER_ENDPOINT)

  Array.from(document.querySelectorAll("form")).forEach(form => {
    form.addEventListener("submit", preventDefault)
  })

  let token = await browser.storage.sync.get("token")
  let user = (await browser.storage.sync.get("user")).user
  if ("token" in token) {
    document.getElementById("auth").style.display = "none"
    document.getElementById("popup").style.display = ""
  } else {
    document.getElementById("auth").style.display = ""
    document.getElementById("popup").style.display = "none"
    return
  }

  let activeTab = (await browser.tabs.query({active: true}))[0]
  let activeHost = ""
  let activeDomain = activeTab.title 
  
  try {
    activeDomain = activeTab.url.split("://")[1].split("/")[0]
  } catch (error) {
    
  }
  document.getElementById("new-alias-name").value = activeDomain
  document.getElementById("user-email").innerHTML = user.email

  aliases = await APICall("aliases", {
    method: "GET"
  })

  aliases.sort((a, _) => {
    return Math.max(activeDomain.toLowerCase().indexOf(a.name.toLowerCase()), a.name.toLowerCase().indexOf(activeDomain.toLowerCase()))
  })

  let listElement = document.getElementById("alias-container")
  listElement.innerHTML = ""
  aliases.forEach(alias => {
    let elementHTML = [`<li data-id="${alias.id}"><span class="alias-name value">${alias.name}</span>`,
    `<span class="alias-actions">`,
    `<button class="alias-copy" title="Copy address"><clr-icon shape="copy" size="21"></clr-icon></button>`,
    `<button class="alias-disconnect" title="${alias.is_disconnected ? 'Reconnect' : 'Disconnect'}"><clr-icon shape="${alias.is_disconnected ? 'connect' : 'disconnect'}" size="21"></clr-icon></button>`,
    `<button class="alias-delete" title="Remove"><clr-icon shape="trash" size="21"></clr-icon></button>`,
    `</span>`,
    `<span class="alias-address value">${alias.proxy_address}</span></li>`].join("")
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
    if (method == "delete") {
      if (!confirm("Are you sure you would like to permanently delete this alias?")) {
        return
      }
    }
    await APICall(`aliases/${id}/${method}`, {
      method: "POST"
    })
    document.dispatchEvent(new Event("DOMContentLoaded"))
  }
}


function onSearchReset() {
  document.getElementById("search-input").value = ""
  onSearchInputChange()
}

function onSearchInputChange() {
  let input = document.getElementById("search-input");
  let filter = input.value.toUpperCase();
  let table = document.getElementById("alias-container");
  let rows = table.querySelectorAll("li");

  Array.from(rows).forEach(row => {
    if (Array.from(row.querySelectorAll(".value")).some(e => {
      let value = e.textContent || e.innerText
      return value.toUpperCase().indexOf(filter) > -1
    })) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  })
}