import "package:flutter/material.dart";
import "package:flutter/widgets.dart";
import "dart:async";
import "models/AuthenticationState.dart";
import "service.dart";

// https://github.com/putraxor/flutter-login-ui/blob/master/lib/login_page.dart

class SignInPage extends StatefulWidget {
  final StreamController<AuthenticationState> _streamController;
  static String tag = "login-page";

  SignInPage(this._streamController);

  signIn() async {
    _streamController.add(AuthenticationState.authenticated());
  }

  @override
  _SignInPageState createState() => new _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  bool _isLoading = false;

  _handleLoginButtonPressed() async {
    setState(() {
      _isLoading = true;
    });

    if(await authenticateUser(emailController.text, passwordController.text)) {
      SignInPage widget = context.widget;
      widget.signIn();
    }
    
    setState(() {
      _isLoading = false;
    });
  }

  Widget _buildButton() {
    return new RaisedButton(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
        ),
        onPressed: _isLoading ? null : () {
          _handleLoginButtonPressed();
        },
        padding: EdgeInsets.all(12),
        color: Colors.lightBlueAccent,
        child: Text("Log In", style: TextStyle(color: Colors.white)),
      );
  }

  @override
  void initState() {
    
    super.initState();
    _isLoading = false;

    
  }

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final logo = Hero(
      tag: "hero",
      child: CircleAvatar(
        backgroundColor: Colors.transparent,
        radius: 48.0,
        child: Text("ForwardMail"),
      ),
    );

    final email = TextFormField(
      keyboardType: TextInputType.emailAddress,
      autofocus: false,
      decoration: InputDecoration(
        hintText: "Email",
        contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(32.0)),
      ),
      controller: emailController,
    );

    final password = TextFormField(
      autofocus: false,
      obscureText: true,
      decoration: InputDecoration(
        hintText: "Password",
        contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(32.0)),
      ),
      controller: passwordController,
    );

    final loginButton = Padding(
      padding: EdgeInsets.symmetric(vertical: 16.0),
      child: _buildButton()
    );

    final forgotLabel = FlatButton(
      child: Text(
        "Forgot password?",
        style: TextStyle(color: Colors.black54),
      ),
      onPressed: () {},
    );

    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: ListView(
          shrinkWrap: true,
          padding: EdgeInsets.only(left: 24.0, right: 24.0),
          children: <Widget>[
            logo,
            SizedBox(height: 48.0),
            email,
            SizedBox(height: 8.0),
            password,
            SizedBox(height: 24.0),
            loginButton,
            forgotLabel
          ],
        ),
      ),
    );
  }
}