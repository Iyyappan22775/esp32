import 'dart:async';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ESP8266Service {
  // Replace with your ESP8266 IP address
  static const String baseUrl = 'http://192.168.4.1';
  
  Timer? _moveTimer;
  
Future<bool> checkConnection() async {
  try {
    final uri = Uri.parse('$baseUrl/status');
    print('Requesting: $uri');

    final response = await http
        .get(uri)
        .timeout(const Duration(seconds: 6));

    print('Status Code: ${response.statusCode}');
    print('Response Body: ${response.body}');

    return response.statusCode == 200;

  } on TimeoutException {
    print('Timeout: ESP not responding');
    return false;

  } catch (e) {
    print('Connection error: $e');
    return false;
  }
}

  Future<void> setEyes(int eyeMode) async {
    try {
      await http.get(Uri.parse('$baseUrl/eyes$eyeMode'));
    } catch (e) {
      print('Error setting eyes: $e');
    }
  }
  
  // Mode selection
  Future<void> setMode(int mode) async {
    try {
      await http.get(Uri.parse('$baseUrl/mode?value=$mode'));
    } catch (e) {
      print('Error setting mode: $e');
    }
  }
  
  // Action selection
  Future<void> setAction(String action) async {
    try {
      await http.get(Uri.parse('$baseUrl/action?value=$action'));
    } catch (e) {
      print('Error setting action: $e');
    }
  }
  
  // Run control
  Future<void> setRun(bool state) async {
    try {
      await http.get(Uri.parse('$baseUrl/run?state=${state ? "on" : "off"}'));
    } catch (e) {
      print('Error setting run: $e');
    }
  }
  
  // Loop control
  Future<void> setLoop(bool state) async {
    try {
      await http.get(Uri.parse('$baseUrl/loop?state=${state ? "on" : "off"}'));
    } catch (e) {
      print('Error setting loop: $e');
    }
  }
  
  // Movement control with hold behavior
  void startMove(String direction) {
    _moveTimer?.cancel();
    _sendMoveCommand(direction);
    _moveTimer = Timer.periodic(const Duration(milliseconds: 150), (timer) {
      _sendMoveCommand(direction);
    });
  }
  
  void stopMove() {
    _moveTimer?.cancel();
    _sendMoveCommand('stop');
  }
  
  Future<void> _sendMoveCommand(String direction) async {
    try {
      await http.get(Uri.parse('$baseUrl/move?dir=$direction'));
    } catch (e) {
      print('Error sending move command: $e');
    }
  }
  
  // Speed control
  Future<void> setSpeed(int speed) async {
    try {
      await http.get(Uri.parse('$baseUrl/speed?value=$speed'));
    } catch (e) {
      print('Error setting speed: $e');
    }
  }
}
