import browser from "webextension-polyfill";

export let endpoint = `${SERVER_ENDPOINT}/api/v1`

export async function APICall(method, options, failureCallback=null) {
  let token = (await browser.storage.sync.get("token")).token
  let response = await fetch(`${endpoint}/${method}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
    ...options
  })
  if (response.status == 401) {
    console.log(response)
    if (failureCallback) {
      return failureCallback()
    } else {
      await logout()
      return
    }
  }
  return response.json()
}

export async function refreshAliases() {
  let aliases = await APICall("aliases", {method: "GET"})
  await browser.storage.sync.set({aliases})
}

export async function createNewAlias(name) {
  await APICall("aliases", {
    method: "POST",
    body: JSON.stringify({alias_name: name})
  })
}

export async function logout() {
  await browser.storage.sync.remove("token")
  await browser.storage.sync.remove("user")
}
