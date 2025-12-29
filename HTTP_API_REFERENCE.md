# ESP8266 HTTP API Reference

Complete API documentation for the robotic control system.

## Base Configuration

```dart
// Update in lib/services/esp8266_service.dart
static const String baseUrl = 'http://192.168.4.1';
```

## Endpoints

### 1. Status Check
**Endpoint**: `GET /status`

**Description**: Returns device connection status and battery level

**Response**:
```json
{
  "connected": true,
  "battery": 85
}
```

**Flutter Implementation**:
```dart
Future<Map<String, dynamic>> checkConnection() async {
  final response = await http.get(Uri.parse('$baseUrl/status'));
  return json.decode(response.body);
}
```

---

### 2. Eyes Control
**Endpoints**: 
- `GET /eyes1`
- `GET /eyes2`
- `GET /eyes3`

**Description**: Controls robot eye display modes

**Parameters**: None

**Flutter Implementation**:
```dart
Future<void> setEyes(int eyeMode) async {
  await http.get(Uri.parse('$baseUrl/eyes$eyeMode'));
}
```

---

### 3. Mode Selection
**Endpoint**: `GET /mode?value={mode}`

**Description**: Sets the operational mode

**Parameters**:
- `value`: Integer (1, 2, or 3)
  - `1` = Gestures mode
  - `2` = Movement mode
  - `3` = Special mode

**Example**: `/mode?value=2`

**Flutter Implementation**:
```dart
Future<void> setMode(int mode) async {
  await http.get(Uri.parse('$baseUrl/mode?value=$mode'));
}
```

---

### 4. Action Selection
**Endpoint**: `GET /action?value={action}`

**Description**: Executes specific action based on current mode

**Parameters**:
- `value`: String (A, B, or C)

**Mode 1 Actions**:
- `A` = Dancing
- `B` = Handshaking
- `C` = Salute

**Mode 2 Actions**:
- `A` = Circle Movement
- `B` = Zig-zag Movement
- `C` = Stop & Blink

**Mode 3 Actions**:
- `A` = Fast Wave
- `B` = Slow Wave
- `C` = Greeting "Vanakkam"

**Example**: `/action?value=A`

**Flutter Implementation**:
```dart
Future<void> setAction(String action) async {
  await http.get(Uri.parse('$baseUrl/action?value=$action'));
}
```

---

### 5. Run Control
**Endpoint**: `GET /run?state={state}`

**Description**: Enables or disables run mode

**Parameters**:
- `state`: String ("on" or "off")

**Example**: `/run?state=on`

**Flutter Implementation**:
```dart
Future<void> setRun(bool state) async {
  await http.get(Uri.parse('$baseUrl/run?state=${state ? "on" : "off"}'));
}
```

---

### 6. Loop Control
**Endpoint**: `GET /loop?state={state}`

**Description**: Enables or disables loop mode

**Parameters**:
- `state`: String ("on" or "off")

**Example**: `/loop?state=off`

**Flutter Implementation**:
```dart
Future<void> setLoop(bool state) async {
  await http.get(Uri.parse('$baseUrl/loop?state=${state ? "on" : "off"}'));
}
```

---

### 7. Movement Control
**Endpoint**: `GET /move?dir={direction}`

**Description**: Controls robot movement (continuous while held)

**Parameters**:
- `dir`: String
  - `forward` = Move forward
  - `backward` = Move backward
  - `left` = Turn left
  - `right` = Turn right
  - `stop` = Stop all movement

**Example**: `/move?dir=forward`

**Behavior**: 
- Sent continuously every 150ms while button is held
- Automatically sends `stop` when button is released

**Flutter Implementation**:
```dart
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
```

---

### 8. Speed Control
**Endpoint**: `GET /speed?value={speed}`

**Description**: Sets movement speed

**Parameters**:
- `value`: Integer (0-100)
  - `0` = Minimum speed
  - `100` = Maximum speed

**Example**: `/speed?value=75`

**Flutter Implementation**:
```dart
Future<void> setSpeed(int speed) async {
  await http.get(Uri.parse('$baseUrl/speed?value=$speed'));
}
```

---

## Error Handling

All API calls include try-catch blocks:

```dart
try {
  await http.get(Uri.parse('$baseUrl/endpoint'));
} catch (e) {
  print('Error: $e');
}
```

## Timeout Configuration

Status check includes 3-second timeout:

```dart
final response = await http.get(
  Uri.parse('$baseUrl/status'),
).timeout(const Duration(seconds: 3));
```

## ESP8266 Arduino Example

```cpp
#include <ESP8266WebServer.h>

ESP8266WebServer server(80);

void setup() {
  // Status endpoint
  server.on("/status", HTTP_GET, []() {
    String json = "{\"connected\":true,\"battery\":85}";
    server.send(200, "application/json", json);
  });
  
  // Eyes endpoints
  server.on("/eyes1", HTTP_GET, []() {
    setEyeMode(1);
    server.send(200, "text/plain", "OK");
  });
  
  // Movement endpoint
  server.on("/move", HTTP_GET, []() {
    String dir = server.arg("dir");
    handleMovement(dir);
    server.send(200, "text/plain", "OK");
  });
  
  server.begin();
}

void loop() {
  server.handleClient();
}
```
