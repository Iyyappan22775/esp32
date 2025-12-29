# ESP32 Signal Testing Guide

## Problem: ESP32 ku signal send aagala

### Step 1: ESP32 Setup
1. Arduino IDE la `esp32_receiver.ino` file a open pannu
2. ESP32 board a USB la connect pannu
3. Tools > Board > ESP32 Dev Module select pannu
4. Tools > Port la correct port select pannu
5. Upload button click panni code a upload pannu

### Step 2: Serial Monitor Check
1. Upload mudinjadukku apram, Tools > Serial Monitor open pannu
2. Bottom right corner la baud rate a **115200** set pannu
3. Indha messages kamikkanum:
   ```
   ESP32 Robot Control - Starting...
   WiFi AP Started
   AP IP address: 192.168.4.1
   SSID: ESP32_Robot
   Password: 12345678
   Waiting for connections...
   HTTP server started
   Ready to receive commands!
   ```

### Step 3: Phone WiFi Connection
1. Phone la WiFi settings ku po
2. "ESP32_Robot" network a search pannu
3. Password enter pannu: **12345678**
4. Connect aana udane Serial Monitor la "Station connected" nu kamikkanum

### Step 4: App Testing
1. App a open pannu
2. Refresh button (top right) click pannu
3. WiFi icon green ah maara vendum (connected)
4. Edhaavadhu button click pannu (Eyes 1, Mode 1, etc.)
5. Serial Monitor la "Received: /eyes1" madhiri messages print aaganum

### Step 5: Troubleshooting

#### Problem: Serial Monitor la "WiFi AP Started" kamikkala
- **Solution**: ESP32 properly connect aagala. USB cable check pannu, board select pannu

#### Problem: Phone la "ESP32_Robot" WiFi kamikkala
- **Solution**: ESP32 restart pannu (reset button press pannu)

#### Problem: Phone connect aachu but app la WiFi icon white ah irukku
- **Solution**: 
  - App close panni reopen pannu
  - Refresh button click pannu
  - Phone browser la `http://192.168.4.1/status` open pannu - work aagudha check pannu

#### Problem: WiFi icon green aachu but Serial Monitor la signals kamikkala
- **Solution**:
  - Serial Monitor close panni reopen pannu
  - Baud rate 115200 ah irukka check pannu
  - ESP32 reset button press pannu

### Step 6: Manual Testing (Browser)
Phone browser la indha URLs try pannu:
- `http://192.168.4.1/status` - Battery info kamikkanum
- `http://192.168.4.1/eyes1` - "OK" kamikkanum
- `http://192.168.4.1/move?dir=forward` - "OK" kamikkanum

Idha try pannumbodhu Serial Monitor la messages print aaganum.

### Expected Serial Monitor Output Example:
```
Received: /status
Received: /eyes1
Received: /mode1?value=A
Received: /move?dir=forward
Received: /speed?value=50
Received: /hand?value=left
Received: /position?part=shoulder&value=1500&hand=left
Received: /save_pose?pos=1&hand=left&head=2000&lateral=2000...
Received: /loop_start
```

## Quick Debug Checklist:
- [ ] ESP32 code uploaded successfully
- [ ] Serial Monitor open (115200 baud)
- [ ] "HTTP server started" message visible
- [ ] Phone connected to "ESP32_Robot" WiFi
- [ ] App WiFi icon green color
- [ ] Buttons clicked in app
- [ ] Serial Monitor showing "Received:" messages

## Common Issues:

### Issue 1: "no-cors" mode la response varadhu
JavaScript la `mode: 'no-cors'` use pannirukkoom. Idhu normal - ESP32 CORS support pannala but commands send aagum.

### Issue 2: Connection timeout
ESP32 range limited (10-20 meters). ESP32 ku close ah irukka try pannu.

### Issue 3: Multiple devices
Oru time la oru device mattum connect pannanum. Vera device disconnect pannu.
