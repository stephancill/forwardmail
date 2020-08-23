import browser from 'webextension-polyfill';
import {APICall, logout} from './utilities'

document.addEventListener('DOMContentLoaded', async () => {
  let user = await APICall("self", {
      method: "GET"
  }, () => null)
  if (user) {
    document.getElementById("user-email").innerHTML = user.email
    document.getElementById("logout-button").addEventListener("click", () => {
      logout()
    })
  } else {
    // TODO: Listen for login
    document.getElementById("user-email").innerHTML = "Please use the extension to log in."
    document.getElementById("logout-button").style.display = "none"
  }
})

