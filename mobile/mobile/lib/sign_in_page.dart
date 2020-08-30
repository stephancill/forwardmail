import "package:flutter/material.dart";
import "package:flutter/widgets.dart";
import "dart:async";
import "models/AuthenticationState.dart";

class SignInPage extends StatelessWidget {
  final StreamController<AuthenticationState> _streamController;

  SignInPage(this._streamController);

  signIn() async {
    _streamController.add(AuthenticationState.authenticated());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Sign in")),
      body: Center(
        child: RaisedButton(
          child: Text("Sign in"),
          onPressed: signIn,
        ),
      ),
    );
  }
}