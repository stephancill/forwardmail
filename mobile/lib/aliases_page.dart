import "dart:async";
import "package:flutter/foundation.dart";
import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:flutter_slidable/flutter_slidable.dart";

import "models/AuthenticationState.dart";
import "models/Alias.dart";
import "models/User.dart";
import "service.dart";


class AliasesPage extends StatefulWidget {
  final StreamController<AuthenticationState> _streamController;

  const AliasesPage(this._streamController);

  signOut() async {
    await logout();
    _streamController.add(AuthenticationState.signedOut());
  }
  @override
  _AliasesPageState createState() => _AliasesPageState();
}

class _AliasesPageState extends State<AliasesPage> {
  Future<List<Alias>> futureAliases;
  Future<User> futureUser;

  @override
  void initState() {
    super.initState();
    futureUser = fetchUser();
    futureAliases = fetchAliases();
  }

  void _showSnackBar(BuildContext context, String message) {
    Scaffold.of(context).removeCurrentSnackBar();
    final snackBar = SnackBar(
      content: Text(message),
    );
    Scaffold.of(context).showSnackBar(snackBar);
  }

  Widget aliasesFutureBuilder() {
    return Center(child: 
      FutureBuilder<List<Alias>>(
        future: futureAliases,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            var aliases = snapshot.data;
            return ListView.builder(
              itemCount: aliases.length,
              itemBuilder: (context, index) {
                var alias = aliases[index];
                return Slidable(
                  child: ListTile(
                    title: Text(alias.name),
                    subtitle: Text(alias.proxyAddress),
                    onTap: (){
                      Clipboard.setData(ClipboardData(text: alias.proxyAddress));
                      _showSnackBar(context, "Copied address of ${alias.name}");
                    },
                  ), 
                  actionPane: SlidableDrawerActionPane(),
                  actions: [
                    IconSlideAction(
                      caption: "Disconnect",
                      color: Colors.blue,
                      icon: alias.isDisconnected ? Icons.link : Icons.link_off,
                      onTap: () => _showSnackBar(context, "Archive"),
                    ),
                  ],
                );
              });
          } else if (snapshot.hasError) {
            return Text("${snapshot.error}");
          }
          // By default, show a loading spinner.
          return CircularProgressIndicator();
        },
      )
    ); 
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "ForwardMail",
      home: Scaffold(
        appBar: AppBar(
          title: Text("ForwardMail"),
          actions: <Widget>[
            // action button
            IconButton(
              icon: Icon(Icons.power_settings_new),
              onPressed: () {
                // TODO: Log user out
                AliasesPage widget = context.widget;
                widget.signOut();
              },
            ),
          ]
        ),
        body: aliasesFutureBuilder()
      ),
    );
  }
}