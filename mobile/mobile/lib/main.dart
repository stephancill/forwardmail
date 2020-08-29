import "dart:io";

import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:flutter_slidable/flutter_slidable.dart";
import "models/Alias.dart";

import "dart:async";
import "dart:convert";
import "package:http/http.dart" as http;

void main() => runApp(MyApp());

Future<List<Alias>> fetchAliases() async {
  final response =
      await http.get("http://10.0.2.2:8080/api/v1/aliases", headers: {HttpHeaders.authorizationHeader : "Token eed3726936579ec217d500dff1bff999add7c649"});

  var aliases = List<Alias>();
  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    var jsonData = json.decode(response.body);
    for (var aliasJson in jsonData) {
      aliases.add(Alias.fromJson(aliasJson));
    }
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception("Failed to load aliases");
  }
  return aliases;
}

class MyApp extends StatefulWidget {
  MyApp({Key key}) : super(key: key);

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  Future<List<Alias>> futureAliases;

  @override
  void initState() {
    super.initState();
    futureAliases = fetchAliases();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "ForwardMail",
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Scaffold(
        appBar: AppBar(
          title: Text("ForwardMail"),
        ),
        body: Center(
          child: FutureBuilder<List<Alias>>(
            future: futureAliases,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                var aliases = snapshot.data;
                return ListView.builder(
                  itemCount: aliases.length,
                  itemBuilder: (context, index) {
                    var alias = aliases[index];
                    return ListTile(
                      title: Text(alias.name),
                      subtitle: Text(alias.proxyAddress),
                      onTap: (){
                        Scaffold.of(context).removeCurrentSnackBar();
                        Clipboard.setData(ClipboardData(text: alias.proxyAddress));
                        final snackBar = SnackBar(
                          content: Text("Copied address of ${alias.name}"),
                        );
                        Scaffold.of(context).showSnackBar(snackBar);
                      },
                    );
                  });
              } else if (snapshot.hasError) {
                return Text("${snapshot.error}");
              }

              // By default, show a loading spinner.
              return CircularProgressIndicator();
            },
          ),
        ),
      ),
    );
  }
}