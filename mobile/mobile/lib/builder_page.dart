import "dart:async";
import "package:flutter/material.dart";
import "sign_in_page.dart";
import "aliases_page.dart";
import "models/AuthenticationState.dart";

// https://codingwithjoe.com/flutter-authentication/

class BuilderPage extends StatelessWidget {
  final StreamController<AuthenticationState> _streamController =
      new StreamController<AuthenticationState>();

  Widget buildUI(BuildContext context, AuthenticationState s) {
    if (s.authenticated) {
      return AliasesPage(_streamController);
    } else {
      return SignInPage(_streamController);
    }
  }

  @override
  Widget build(BuildContext context) {
    return new StreamBuilder<AuthenticationState>(
      stream: _streamController.stream,
      initialData: new AuthenticationState.initial(),
      builder: (BuildContext context,
          AsyncSnapshot<AuthenticationState> snapshot) {
        final state = snapshot.data;
        return buildUI(context, state);
      });
  }
}