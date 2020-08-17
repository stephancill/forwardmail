import 'emoji-log';
import browser from 'webextension-polyfill';

let endpoint = "http://127.0.0.1:8001/api/v1"

async function APICall(method, options) {
  let token = (await browser.storage.sync.get("token")).token
  console.log((await browser.storage.sync.get("token")).token)
  let response = await fetch(`${endpoint}/${method}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Token ${token}`
    },
    ...options
  })
  return response.json()
}

document.getElementById("sign-in").addEventListener('click', async () => {
  let email = document.getElementById("auth-email").value
  let password = document.getElementById("auth-password").value

  let data = {
    username: email,
    password
  }
  let response = await fetch(`${endpoint}/token`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  let json = await response.json()
  let token = json.token

  if (token) {
    browser.storage.sync.set({token})
    document.dispatchEvent(new Event("DOMContentLoaded"))
  } else {
    // TODO: Show error
  }
})

function openWebPage(url) {
  return browser.tabs.create({url});
}

document.addEventListener('DOMContentLoaded', async () => {
  let token = await browser.storage.sync.get("token")
  if ("token" in token) {
    document.getElementById("auth").style.display = "none"
    document.getElementById("popup").style.display = ""
  } else {
    document.getElementById("auth").style.display = ""
    document.getElementById("popup").style.display = "none"
    return
  }


  let aliases = await APICall("aliases", {
    method: "GET"
  })
  let listElement = document.getElementById("alias-container")
  aliases.forEach(alias => {
    listElement.innerHTML += `<li>${alias.name}-${alias.proxy_address}</li>`
  });

  document.getElementById("new-alias-create").addEventListener("click", async () => {
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
  })

  document.getElementById("auth-logout").addEventListener("click", async () => {
    await browser.storage.sync.remove("token")
    document.dispatchEvent(new Event("DOMContentLoaded"))
  })
});
