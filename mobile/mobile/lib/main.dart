import "package:flutter/material.dart";
import "builder_page.dart";

void main() => runApp(new MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: "ForwardMail",
      home: new BuilderPage(),
    );
  }
}