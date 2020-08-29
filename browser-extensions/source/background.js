import browser from "webextension-polyfill"

browser.runtime.onMessage.addListener(async function(message) {
    if ("token" in message) {
        await browser.storage.sync.set({token: message.token})
    }
});