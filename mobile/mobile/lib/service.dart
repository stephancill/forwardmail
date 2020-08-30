import "dart:async";
import "dart:convert";
import "package:http/http.dart" as http;
import "dart:io";

import "models/Alias.dart";
import "models/User.dart";

Future<User> fetchUser() async {
  final response =
      await http.get("http://10.0.2.2:8080/api/v1/self", headers: {HttpHeaders.authorizationHeader : "Token eed3726936579ec217d500dff1bff999add7c649"});

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    var userJson = json.decode(response.body);
    return User.fromJson(userJson);
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception("Failed to load aliases");
  }
}

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