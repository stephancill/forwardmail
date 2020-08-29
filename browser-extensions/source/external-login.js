import browser from 'webextension-polyfill'

let token = document.getElementById("token").value
browser.runtime.sendMessage({token});
