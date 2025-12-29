#include <WiFi.h>
#include <WebServer.h>

// WiFi credentials
const char* ssid = "ESP32_Robot";
const char* password = "12345678";

// Create web server on port 80
WebServer server(80);

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n========================================");
  Serial.println("ESP32 Robot Control - SIMPLE TEST");
  Serial.println("========================================\n");
  
  // Start WiFi Access Point
  Serial.println("Starting WiFi AP...");
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
  
  // Simple test endpoint
  server.on("/", HTTP_GET, []() {
    Serial.println("✓ ROOT REQUEST RECEIVED!");
    server.send(200, "text/html", "<h1>ESP32 Working!</h1>");
  });
  
  server.on("/status", HTTP_GET, []() {
    Serial.println("✓ STATUS REQUEST RECEIVED!");
    server.send(200, "application/json", "{\"connected\":true,\"battery\":85}");
  });
  
  server.on("/test", HTTP_GET, []() {
    Serial.println("✓ TEST REQUEST RECEIVED!");
    server.send(200, "text/plain", "Test OK");
  });
  
  // Eyes
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
  
  // Modes
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
  
  // Movement
  server.on("/move", HTTP_GET, []() {
    String dir = server.arg("dir");
    Serial.print("✓ MOVE - Direction: ");
    Serial.println(dir);
    server.send(200, "text/plain", "OK");
  });
  
  // Speed
  server.on("/speed", HTTP_GET, []() {
    String value = server.arg("value");
    Serial.print("✓ SPEED - Value: ");
    Serial.println(value);
    server.send(200, "text/plain", "OK");
  });
  
  // Hand
  server.on("/hand", HTTP_GET, []() {
    String value = server.arg("value");
    Serial.print("✓ HAND - Value: ");
    Serial.println(value);
    server.send(200, "text/plain", "OK");
  });
  
  // Position
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
  
  // Home
  server.on("/home", HTTP_GET, []() {
    Serial.println("✓ HOME BUTTON PRESSED");
    server.send(200, "text/plain", "OK");
  });
  
  // Save pose
  server.on("/save_pose", HTTP_GET, []() {
    String pos = server.arg("pos");
    Serial.print("✓ SAVE POSE - Position: ");
    Serial.println(pos);
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
    Serial.println("✓ LOOP UNDO");
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/loop_delete", HTTP_GET, []() {
    Serial.println("✓ LOOP DELETED");
    server.send(200, "text/plain", "OK");
  });
  
  // Model selection
  server.on("/select_model", HTTP_GET, []() {
    String name = server.arg("name");
    Serial.print("✓ MODEL SELECTED: ");
    Serial.println(name);
    server.send(200, "text/plain", "OK");
  });
  
  // Start server
  server.begin();
  Serial.println("✓ HTTP Server Started");
  Serial.println("\n========================================");
  Serial.println("READY TO RECEIVE COMMANDS!");
  Serial.println("========================================\n");
}

void loop() {
  server.handleClient();
  
  // Print connected devices count every 5 seconds
  static unsigned long lastCheck = 0;
  if (millis() - lastCheck > 5000) {
    lastCheck = millis();
    int numClients = WiFi.softAPgetStationNum();
    Serial.print("Connected devices: ");
    Serial.println(numClients);
  }
}
