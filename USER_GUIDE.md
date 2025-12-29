# Technobot Pro - User Guide

## 📱 SETUP INSTRUCTIONS FOR NEW USERS

### Step 1: Hardware Setup (ESP32)
```
1. Connect ESP32 to power
2. Wait 5 seconds for WiFi to start
3. ESP32 will create WiFi network: "ESP32_Robot"
```

### Step 2: Phone Setup
```
1. Install Technobot Pro APK on phone
2. Open phone WiFi settings
3. Look for WiFi network: "ESP32_Robot"
4. Connect to it
5. Password: 12345678
6. Wait for connection (may take 10-15 seconds)
```

**IMPORTANT:** Phone will show "No Internet" - this is NORMAL! Don't disconnect!

### Step 3: App Setup
```
1. Open Technobot Pro app
2. Wait 3-5 seconds
3. WiFi icon (top right) should turn GREEN
4. If icon stays WHITE:
   - Close app
   - Check phone is still connected to ESP32_Robot WiFi
   - Reopen app
```

### Step 4: Test Connection
```
1. Click "Eyes 1" button
2. Button should change color (visual feedback)
3. If you have Serial Monitor open, you'll see: "✓ EYES 1 SELECTED"
```

---

## ❌ COMMON PROBLEMS & SOLUTIONS

### Problem 1: Can't Find "ESP32_Robot" WiFi
**Cause**: ESP32 not powered or not running
**Solution**:
- Check ESP32 has power
- Press ESP32 reset button
- Wait 10 seconds
- Scan WiFi again

### Problem 2: Can't Connect to "ESP32_Robot"
**Cause**: Wrong password or ESP32 issue
**Solution**:
- Password is: 12345678 (all numbers)
- Try "Forget Network" and reconnect
- Restart ESP32

### Problem 3: Phone Keeps Disconnecting
**Cause**: Phone auto-switches to WiFi with internet
**Solution**:
**Android:**
1. Settings > WiFi
2. Tap ESP32_Robot
3. Advanced > "Stay connected even without internet" = ON

**iOS:**
1. Settings > WiFi
2. Tap (i) next to ESP32_Robot
3. Auto-Join = ON
4. Low Data Mode = OFF

### Problem 4: WiFi Icon Stays White
**Cause**: App can't reach ESP32
**Solution**:
1. Close app completely
2. Check phone WiFi shows "ESP32_Robot" as connected
3. Open phone browser
4. Go to: http://192.168.4.1/status
5. Should show: {"connected":true,"battery":85}
6. If browser works, reopen app

### Problem 5: Buttons Don't Respond
**Cause**: Touch interaction issue
**Solution**:
1. Uninstall app completely
2. Restart phone
3. Reinstall APK
4. Try again

### Problem 6: Video Splash Screen Stuck
**Cause**: Video loading issue
**Solution**:
- Wait 10 seconds (video will auto-skip)
- Or close and reopen app

---

## 🔧 TESTING WITHOUT ESP32

**You CANNOT test without ESP32!**

The app needs ESP32 to work. Without ESP32:
- WiFi icon will stay WHITE
- Buttons will click but do nothing
- No signals will be sent

**To test properly:**
1. Must have ESP32 with code uploaded
2. Must connect phone to ESP32_Robot WiFi
3. Then app will work

---

## 📋 QUICK CHECKLIST

Before asking "why not working":
- [ ] ESP32 powered on
- [ ] ESP32 code uploaded (esp32_final.ino)
- [ ] Phone connected to "ESP32_Robot" WiFi (not other WiFi!)
- [ ] Phone shows "Connected" (even if "No Internet")
- [ ] App installed (43.9MB APK)
- [ ] Waited 5 seconds after opening app
- [ ] WiFi icon turned GREEN

If ALL checked and still not working:
- Test browser: http://192.168.4.1/status
- If browser works → App issue
- If browser doesn't work → ESP32/WiFi issue

---

## 🎯 FOR YOUR FRIEND

**Tell your friend:**

1. **You MUST have ESP32 hardware**
   - App alone won't work
   - Need ESP32 with uploaded code

2. **Connect to ESP32_Robot WiFi**
   - Not your home WiFi
   - Not mobile data
   - Only ESP32_Robot WiFi

3. **Phone will say "No Internet"**
   - This is normal
   - Don't disconnect
   - App will still work

4. **Test with browser first**
   - http://192.168.4.1/status
   - If this works, app will work
   - If this doesn't work, ESP32 issue

---

## 📞 SUPPORT CHECKLIST

If your friend says "not working", ask:

1. **Do you have ESP32 hardware?**
   - If NO → Can't use app without ESP32

2. **Is ESP32 powered on?**
   - If NO → Turn it on

3. **Can you see "ESP32_Robot" WiFi?**
   - If NO → ESP32 not working or not programmed

4. **Are you connected to ESP32_Robot WiFi?**
   - If NO → Connect to it (password: 12345678)

5. **Does browser test work?** (http://192.168.4.1/status)
   - If NO → ESP32 or WiFi connection issue
   - If YES → App issue (reinstall app)

---

## ✅ SUCCESS INDICATORS

**You know it's working when:**
1. ✅ Phone WiFi shows "ESP32_Robot" connected
2. ✅ App WiFi icon is GREEN (not white)
3. ✅ Browser test shows JSON response
4. ✅ Buttons change color when clicked
5. ✅ (If Serial Monitor open) Signals print when buttons clicked

**If ANY of above is missing, something is wrong!**
