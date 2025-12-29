/*
 * ESP32 Robot Control Receiver - FINAL VERSION
 * 
 * This code receives HTTP commands from the Technobot Pro mobile app
 * and prints all received signals to Serial Monitor for debugging.
 * 
 * WiFi AP Configuration:
 * - SSID: ESP32_Robot
 * - Password: 12345678
 * - IP Address: 192.168.4.1
 * 
 * Serial Monitor: 115200 baud
 * 
 * Compatible with Technobot Pro App v1.0
 */

#include <WiFi.h>
#include <WebServer.h>

// WiFi Access Point credentials
const char* ssid = "ESP32_Robot";
const char* password = "12345678";

// Create web server on port 80
WebServer server(80);

void setup() {
  // Initialize Serial Monitor
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n========================================");
  Serial.println("   ESP32 ROBOT CONTROL RECEIVER");
  Serial.println("   Technobot Pro - Final Version");
  Serial.println("========================================\n");
  
  // Start WiFi Access Point
  Serial.println("Starting WiFi Access Point...");
  WiFi.softAP(ssid, password);
  
  delay(1000);
  
  IPAddress IP = WiFi.softAPIP();
  
  Serial.println("\n✓ WiFi AP Started Successfully!");
  Serial.println("========================================");
  Serial.print("SSID: ");
  Serial.println(ssid);
  Serial.print("Password: ");
  Serial.println(password);
  Serial.print("IP Address: ");
  Serial.println(IP);
  Serial.println("========================================");
  Serial.println("\nWaiting for phone to connect...");
  Serial.println("(Connect your phone to 'ESP32_Robot' WiFi)\n");
  
  // ========================================
  // MOTION PAGE ENDPOINTS
  // ========================================
  
  // Status check
  server.on("/status", HTTP_GET, []() {
    Serial.println("✓ STATUS CHECK");
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200, "application/json", "{\"connected\":true,\"battery\":85}");
  });
  
  // Eyes selection (Eyes 1, 2, 3)
  server.on("/eyes1", HTTP_GET, []() {
    Serial.println("✓ EYES 1 SELECTED");
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/eyes2", HTTP_GET, []() {
    Serial.println("✓ EYES 2 SELECTED");
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/eyes3", HTTP_GET, []() {
    Serial.println("✓ EYES 3 SELECTED");
    server.send(200, "text/plain", "OK");
  });
  
  // Mode selections (Mode 1, 2, 3 with dropdown values A, B, C)
  server.on("/mode1", HTTP_GET, []() {
    String value = server.arg("value");
    Serial.print("✓ MODE 1 - Value: ");
    Serial.println(value);
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/mode2", HTTP_GET, []() {
    String value = server.arg("value");
    Serial.print("✓ MODE 2 - Value: ");
    Serial.println(value);
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/mode3", HTTP_GET, []() {
    String value = server.arg("value");
    Serial.print("✓ MODE 3 - Value: ");
    Serial.println(value);
    server.send(200, "text/plain", "OK");
  });
  
  // Movement control (forward, backward, left, right, stop)
  server.on("/move", HTTP_GET, []() {
    String dir = server.arg("dir");
    Serial.print("✓ MOVE - Direction: ");
    Serial.println(dir);
    server.send(200, "text/plain", "OK");
  });
  
  // Speed control (0-100)
  server.on("/speed", HTTP_GET, []() {
    String value = server.arg("value");
    Serial.print("✓ SPEED - Value: ");
    Serial.println(value);
    server.send(200, "text/plain", "OK");
  });
  
  // ========================================
  // ACTION PAGE ENDPOINTS
  // ========================================
  
  // Hand selection (left, right, both)
  server.on("/hand", HTTP_GET, []() {
    String value = server.arg("value");
    Serial.print("✓ HAND SELECTED - Value: ");
    Serial.println(value);
    server.send(200, "text/plain", "OK");
  });
  
  // Body part position control (head, lateral, shoulder, forearm, elbow, wrist, fingers)
  server.on("/position", HTTP_GET, []() {
    String part = server.arg("part");
    String value = server.arg("value");
    String hand = server.arg("hand");
    Serial.print("✓ POSITION - Part: ");
    Serial.print(part);
    Serial.print(", Value: ");
    Serial.print(value);
    Serial.print(", Hand: ");
    Serial.println(hand);
    server.send(200, "text/plain", "OK");
  });
  
  // Home button (reset all sliders to 1000)
  server.on("/home", HTTP_GET, []() {
    Serial.println("✓ HOME BUTTON PRESSED - Reset to 1000");
    server.send(200, "text/plain", "OK");
  });
  
  // Save pose (saves all 7 body part values)
  server.on("/save_pose", HTTP_GET, []() {
    String pos = server.arg("pos");
    String hand = server.arg("hand");
    String head = server.arg("head");
    String lateral = server.arg("lateral");
    String shoulder = server.arg("shoulder");
    String forearm = server.arg("forearm");
    String elbow = server.arg("elbow");
    String wrist = server.arg("wrist");
    String fingers = server.arg("fingers");
    
    Serial.print("✓ SAVE POSE - Position: ");
    Serial.print(pos);
    Serial.print(", Hand: ");
    Serial.println(hand);
    Serial.print("  Values - Head: ");
    Serial.print(head);
    Serial.print(", Lateral: ");
    Serial.print(lateral);
    Serial.print(", Shoulder: ");
    Serial.print(shoulder);
    Serial.print(", Forearm: ");
    Serial.print(forearm);
    Serial.print(", Elbow: ");
    Serial.print(elbow);
    Serial.print(", Wrist: ");
    Serial.print(wrist);
    Serial.print(", Fingers: ");
    Serial.println(fingers);
    
    server.send(200, "text/plain", "OK");
  });
  
  // Loop controls
  server.on("/loop_start", HTTP_GET, []() {
    Serial.println("✓ LOOP STARTED");
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/loop_stop", HTTP_GET, []() {
    Serial.println("✓ LOOP STOPPED");
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/loop_undo", HTTP_GET, []() {
    Serial.println("✓ LOOP UNDO - Last position removed");
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/loop_delete", HTTP_GET, []() {
    Serial.println("✓ LOOP DELETED - All positions cleared");
    server.send(200, "text/plain", "OK");
  });
  
  // ========================================
  // MODELS PAGE ENDPOINTS
  // ========================================
  
  // Model selection
  server.on("/select_model", HTTP_GET, []() {
    String name = server.arg("name");
    Serial.print("✓ MODEL SELECTED: ");
    Serial.println(name);
    server.send(200, "text/plain", "OK");
  });
  
  // Start HTTP server
  server.begin();
  Serial.println("✓ HTTP Server Started");
  Serial.println("\n========================================");
  Serial.println("READY TO RECEIVE COMMANDS!");
  Serial.println("========================================\n");
}

void loop() {
  // Handle incoming HTTP requests
  server.handleClient();
  
  // Check for new WiFi connections
  static int previousClients = 0;
  int currentClients = WiFi.softAPgetStationNum();
  
  if (currentClients != previousClients) {
    if (currentClients > previousClients) {
      Serial.println("\n========================================");
      Serial.println("✓✓✓ PHONE CONNECTED TO ESP32 WiFi! ✓✓✓");
      Serial.println("========================================");
      Serial.print("Total connected devices: ");
      Serial.println(currentClients);
      Serial.println("You can now use the app!");
      Serial.println("========================================\n");
    } else {
      Serial.println("\n✗ Phone disconnected");
      Serial.print("Remaining devices: ");
      Serial.println(currentClients);
      Serial.println();
    }
    previousClients = currentClients;
  }
}
