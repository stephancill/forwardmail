import React from "react";
import LoginForm from "./LoginForm"
import browser from "webextension-polyfill"

function openGoogleSignIn(url) {
  browser.tabs.create({url})
}

const UnauthenticatedPopup = () => {
  return (
    <section id="auth">
      <LoginForm ></LoginForm>
      <button onClick={() => {
        openGoogleSignIn(SERVER_ENDPOINT + "/accounts/login/google?ref=extension")
      }}><img src="/static/img/google-button.png" alt=""/></button>
      
    </section>
  );
};

export default UnauthenticatedPopup;
