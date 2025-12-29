/*
 * ESP32 Robot Control Receiver - WITH CORS SUPPORT
 * 
 * This version includes CORS headers to fix connection issues
 */

#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "ESP32_Robot";
const char* password = "12345678";

WebServer server(80);

// Helper function to send response with CORS headers
void sendCORSResponse(int code, const char* contentType, const char* content) {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(code, contentType, content);
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n========================================");
  Serial.println("   ESP32 ROBOT - WITH CORS");
  Serial.println("========================================\n");
  
  WiFi.softAP(ssid, password);
  delay(1000);
  
  IPAddress IP = WiFi.softAPIP();
  
  Serial.println("✓ WiFi AP Started!");
  Serial.print("SSID: ");
  Serial.println(ssid);
  Serial.print("Password: ");
  Serial.println(password);
  Serial.print("IP: ");
  Serial.println(IP);
  Serial.println("\n========================================\n");
  
  // Handle OPTIONS requests for CORS preflight
  server.onNotFound([]() {
    if (server.method() == HTTP_OPTIONS) {
      sendCORSResponse(200, "text/plain", "");
    } else {
      sendCORSResponse(404, "text/plain", "Not Found");
    }
  });
  
  // Status
  server.on("/status", HTTP_GET, []() {
    Serial.println("✓ STATUS CHECK");
    sendCORSResponse(200, "application/json", "{\"connected\":true,\"battery\":85}");
  });
  
  // Eyes
  server.on("/eyes1", HTTP_GET, []() {
    Serial.println("✓ EYES 1");
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  server.on("/eyes2", HTTP_GET, []() {
    Serial.println("✓ EYES 2");
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  server.on("/eyes3", HTTP_GET, []() {
    Serial.println("✓ EYES 3");
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  // Modes
  server.on("/mode1", HTTP_GET, []() {
    Serial.print("✓ MODE 1 - ");
    Serial.println(server.arg("value"));
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  server.on("/mode2", HTTP_GET, []() {
    Serial.print("✓ MODE 2 - ");
    Serial.println(server.arg("value"));
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  server.on("/mode3", HTTP_GET, []() {
    Serial.print("✓ MODE 3 - ");
    Serial.println(server.arg("value"));
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  // Move
  server.on("/move", HTTP_GET, []() {
    Serial.print("✓ MOVE - ");
    Serial.println(server.arg("dir"));
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  // Speed
  server.on("/speed", HTTP_GET, []() {
    Serial.print("✓ SPEED - ");
    Serial.println(server.arg("value"));
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  // Hand
  server.on("/hand", HTTP_GET, []() {
    Serial.print("✓ HAND - ");
    Serial.println(server.arg("value"));
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  // Position
  server.on("/position", HTTP_GET, []() {
    Serial.print("✓ POSITION - ");
    Serial.print(server.arg("part"));
    Serial.print(" = ");
    Serial.print(server.arg("value"));
    Serial.print(" (");
    Serial.print(server.arg("hand"));
    Serial.println(")");
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  // Home
  server.on("/home", HTTP_GET, []() {
    Serial.println("✓ HOME");
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  // Save pose
  server.on("/save_pose", HTTP_GET, []() {
    Serial.print("✓ SAVE POSE ");
    Serial.println(server.arg("pos"));
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  // Loop
  server.on("/loop_start", HTTP_GET, []() {
    Serial.println("✓ LOOP START");
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  server.on("/loop_stop", HTTP_GET, []() {
    Serial.println("✓ LOOP STOP");
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  server.on("/loop_undo", HTTP_GET, []() {
    Serial.println("✓ LOOP UNDO");
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  server.on("/loop_delete", HTTP_GET, []() {
    Serial.println("✓ LOOP DELETE");
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  // Model
  server.on("/select_model", HTTP_GET, []() {
    Serial.print("✓ MODEL - ");
    Serial.println(server.arg("name"));
    sendCORSResponse(200, "text/plain", "OK");
  });
  
  server.begin();
  Serial.println("✓ SERVER STARTED");
  Serial.println("\n========================================");
  Serial.println("READY TO RECEIVE COMMANDS!");
  Serial.println("========================================\n");
}

void loop() {
  server.handleClient();
  
  static unsigned long lastCheck = 0;
  if (millis() - lastCheck > 5000) {
    lastCheck = millis();
    int numClients = WiFi.softAPgetStationNum();
    if (numClients > 0) {
      Serial.print("📱 Devices: ");
      Serial.println(numClients);
    }
  }
}
