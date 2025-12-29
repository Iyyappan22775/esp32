# ESP32 Connection Troubleshooting

## Problem: WiFi icon stays white, no signals received

### Step 1: Test with Browser FIRST

1. **Connect phone to ESP32_Robot WiFi**
   - SSID: ESP32_Robot
   - Password: 12345678

2. **Open phone browser** (Chrome/Safari)
   - Go to: `http://192.168.4.1/status`
   - Should see: `{"connected":true,"battery":85}`
   - Serial Monitor should show: `✓ STATUS CHECK`

3. **If browser works but app doesn't:**
   - Problem is in the app
   - Try test_connection.html file

4. **If browser also doesn't work:**
   - Problem is ESP32 or WiFi connection

---

### Step 2: Use Test HTML File

1. Copy `test_connection.html` to phone
2. Open in browser
3. Click "Test Connection" button
4. Check Serial Monitor for signals

---

### Step 3: Common Issues

#### Issue 1: Phone disconnects from ESP32 WiFi
**Reason**: Phone thinks there's no internet and auto-disconnects

**Solution**:
- Android: Settings > WiFi > ESP32_Robot > Advanced > "Stay connected even without internet" = ON
- iOS: Settings > WiFi > ESP32_Robot > Auto-Join = ON

#### Issue 2: Serial Monitor shows "READY" but no signals
**Possible causes**:
1. Phone not actually connected to ESP32 WiFi
2. IP address wrong (should be 192.168.4.1)
3. CORS issue (use esp32_with_cors.ino)

**Solution**:
- Upload `esp32_with_cors.ino` instead
- This adds CORS headers to fix connection issues

#### Issue 3: WiFi icon in app stays white
**Reason**: App can't reach ESP32

**Solution**:
1. Test with browser first: `http://192.168.4.1/status`
2. If browser works, rebuild APK
3. Make sure phone WiFi is connected (not just saved)

---

### Step 4: Upload CORS-enabled ESP32 Code

1. Open `esp32_with_cors.ino` in Arduino IDE
2. Upload to ESP32
3. Open Serial Monitor (115200 baud)
4. Test with browser: `http://192.168.4.1/status`
5. Then test with app

---

### Step 5: Verify Connection

**In Serial Monitor, you should see:**
```
✓ WiFi AP Started!
SSID: ESP32_Robot
Password: 12345678
IP: 192.168.4.1

✓ SERVER STARTED
READY TO RECEIVE COMMANDS!

📱 Devices: 1
✓ STATUS CHECK
✓ EYES 1
✓ MODE 1 - A
```

**If you see this, ESP32 is working correctly!**

---

### Step 6: Phone WiFi Settings

**Android:**
1. Settings > WiFi
2. Tap ESP32_Robot
3. Advanced options
4. "Metered connection" = OFF
5. "Stay connected" = ON

**iOS:**
1. Settings > WiFi
2. Tap (i) next to ESP32_Robot
3. Auto-Join = ON
4. Low Data Mode = OFF

---

### Quick Test Commands (Browser)

Open these URLs in phone browser:

1. `http://192.168.4.1/status` - Should show JSON
2. `http://192.168.4.1/eyes1` - Should show "OK"
3. `http://192.168.4.1/move?dir=forward` - Should show "OK"

Each URL should print a message in Serial Monitor.

---

### Final Checklist

- [ ] ESP32 code uploaded (esp32_with_cors.ino)
- [ ] Serial Monitor shows "READY TO RECEIVE COMMANDS"
- [ ] Phone connected to ESP32_Robot WiFi
- [ ] Serial Monitor shows "📱 Devices: 1"
- [ ] Browser test works: http://192.168.4.1/status
- [ ] Serial Monitor shows "✓ STATUS CHECK" when browser test runs
- [ ] App installed on phone
- [ ] App refresh button clicked

If all checked and still not working, the issue is in the app code - need to rebuild APK.
