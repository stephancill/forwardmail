class Alias {
  final int id;
  final String name;
  final String proxyAddress;
  final DateTime date;
  final bool isDisconnected;

  Alias({this.id, this.name, this.proxyAddress, this.date, this.isDisconnected});

  factory Alias.fromJson(Map<String, dynamic> json) {
    return Alias(
      id: json["id"],
      name: json["name"],
      proxyAddress: json["proxy_address"],
      date: DateTime.parse(json["date"]),
      isDisconnected: json["is_disconnected"]
    );
  }
}