import "dart:async";
import "dart:convert";
import "dart:io";
import "package:http/http.dart" as http;
import 'package:shared_preferences/shared_preferences.dart';

import "models/Alias.dart";
import "models/User.dart";

import "env.dart";

String SERVER_ENDPOINT = environment["SERVER_ENDPOINT"];

Future<bool> authenticateUser(String email, String password) async {
  var uri = Uri.parse("$SERVER_ENDPOINT/token");
  var request = http.MultipartRequest('POST', uri)
    ..fields['username'] = email
    ..fields['password'] = password;
  var response = await request.send();
  
  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    final respStr = await response.stream.bytesToString();
    var tokenJson = json.decode(respStr);
    var token = tokenJson["token"];
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString("token", token);
    return true;
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception("Failed to authenticate");
  }
}

Future<void> logout() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  await prefs.remove("token");
}

Future<String> getToken() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.getString("token");
}

Future<User> fetchUser() async {
  var token = await getToken();
  final response =
      await http.get("$SERVER_ENDPOINT/self", headers: {HttpHeaders.authorizationHeader : "Token $token"});

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    var userJson = json.decode(response.body);
    User user = User.fromJson(userJson);
    return user;
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception("Failed to load aliases");
  }
}

Future<List<Alias>> fetchAliases() async {
  var token = await getToken();
  final response =
      await http.get("$SERVER_ENDPOINT/aliases", headers: {HttpHeaders.authorizationHeader : "Token $token"});

  print("Token $token");
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