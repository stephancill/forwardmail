const bool isProduction = bool.fromEnvironment("dart.vm.product");

const testConfig = {
  // "SERVER_ENDPOINT": "https://forwardmail.herokuapp.com/api/v1"
  "SERVER_ENDPOINT": "http://10.0.2.2:8080/api/v1"
};

const productionConfig = {
  "SERVER_ENDPOINT": "https://forwardmail.herokuapp.com/api/v1"
};

final environment = isProduction ? productionConfig : testConfig;