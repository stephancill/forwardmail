class User {
  final int id;
  final String email;
  final String firstName;
  final bool isActive;
  final DateTime dateJoined;

  User({this.id, this.email, this.firstName, this.isActive, this.dateJoined});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json["id"],
      email: json["email"],
      firstName: json["first_name"],
      dateJoined: DateTime.parse(json["date_joined"]),
      isActive: json["is_active"]
    );
  }
}