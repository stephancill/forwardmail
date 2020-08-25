import React from "react";
import LoginForm from "./LoginForm"

const UnauthenticatedPopup = () => {
  return (
    <section id="auth">
      <LoginForm ></LoginForm>
    </section>
  );
};

export default UnauthenticatedPopup;
