# forwardmail.rocks

A simple proxy for your email address which creates aliases which can be easily disconnected to prevent unwanted email spam and protect your privacy. It consists of a web app and a cross-browser extension.

Apple introduced a similar concept with [Sign in with Apple](https://support.apple.com/en-us/HT210318) at WWDC 2019, but forwardmail was before them!

Discontinued, but still used by a few people.

## How it works

When you create an alias, it generates a random string uses the Gandi.net API to create a forwarding alias to your actual email address using that string. When you disconnect an alias, it deletes the alias from Gandi.net.

## Screenshots

![forwardmail.rocks website and extension](https://github.com/stephancill/forwardmail/blob/master/screenshots/screenshot.png?raw=true)
