# Robotic Control UI - Flutter App

Modern robotic control interface for ESP8266 module with full HTTP integration.

## Features

### Status Bar
- **Custom Logo Placeholder** - Replace with your PNG/SVG logo
- **Battery Indicator** - Real-time battery percentage from ESP8266
- **WiFi Status** - Green blinking (connected) / Red static (disconnected)
- **Refresh Button** - Manual connection status check

### Eyes Control
3-tab segmented control with HTTP endpoints:
- Eyes 1 → `/eyes1`
- Eyes 2 → `/eyes2`
- Eyes 3 → `/eyes3`

### Mode & Action System
**Mode 1 - Gestures:**
- Dancing (A)
- Handshaking (B)
- Salute (C)

**Mode 2 - Movement:**
- Circle Movement (A)
- Zig-zag Movement (B)
- Stop & Blink (C)

**Mode 3 - Special:**
- Fast Wave (A)
- Slow Wave (B)
- Greeting "Vanakkam" (C)

HTTP Endpoints:
- Mode: `/mode?value=1/2/3`
- Action: `/action?value=A/B/C`

### Run & Loop Controls
- Run: `/run?state=on/off`
- Loop: `/loop?state=on/off`

### Direction Pad (Hold-to-Move)
Press and hold behavior with continuous HTTP requests every 150ms:
- Forward → `/move?dir=forward`
- Backward → `/move?dir=backward`
- Left → `/move?dir=left`
- Right → `/move?dir=right`
- Release → `/move?dir=stop`

### Speed Slider
- Range: 0-100
- Endpoint: `/speed?value=XX`

## Setup

1. Update ESP8266 IP address in `lib/services/esp8266_service.dart`:
```dart
static const String baseUrl = 'http://YOUR_ESP8266_IP';
```

2. Install dependencies:
```bash
flutter pub get
```

3. Run the app:
```bash
flutter run
```

## ESP8266 API Endpoints

Your ESP8266 should implement these endpoints:

- `GET /status` - Returns `{"connected": true, "battery": 85}`
- `GET /eyes1`, `/eyes2`, `/eyes3` - Eye mode control
- `GET /mode?value=1/2/3` - Mode selection
- `GET /action?value=A/B/C` - Action selection
- `GET /run?state=on/off` - Run control
- `GET /loop?state=on/off` - Loop control
- `GET /move?dir=forward/backward/left/right/stop` - Movement control
- `GET /speed?value=0-100` - Speed control

## Color Scheme

- Background: `#0A0E27`
- Card Background: `#1A1F3A`
- Primary Accent: `#00D9FF` (Cyan)
- Secondary Accent: `#0066FF` (Blue)
- Success: Green
- Error: Red

## Customization

Replace the logo placeholder in `lib/widgets/status_bar.dart`:
```dart
// Replace this container with your Image.asset()
Container(
  width: 40,
  height: 40,
  child: Image.asset('assets/logo.png'),
)
```

Add your logo to `pubspec.yaml`:
```yaml
flutter:
  assets:
    - assets/logo.png
```
