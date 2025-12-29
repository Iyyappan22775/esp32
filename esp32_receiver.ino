#include <WiFi.h>
#include <WebServer.h>

// WiFi credentials
const char* ssid = "ESP32_Robot";
const char* password = "12345678";

// Create web server on port 80
WebServer server(80);

void setup() {
  Serial.begin(115200);
  Serial.println("\n\nESP32 Robot Control - Starting...");
  
  // Start WiFi Access Point
  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  
  Serial.println("WiFi AP Started");
  Serial.print("AP IP address: ");
  Serial.println(IP);
  Serial.print("SSID: ");
  Serial.println(ssid);
  Serial.print("Password: ");
  Serial.println(password);
  Serial.println("Waiting for connections...\n");
  
  // Define all routes
  
  // Status endpoint
  server.on("/status", HTTP_GET, []() {
    Serial.println("Received: /status");
    server.send(200, "application/json", "{\"connected\":true,\"battery\":85}");
  });
  
  // Eyes selection
  server.on("/eyes1", HTTP_GET, []() {
    Serial.println("Received: /eyes1");
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/eyes2", HTTP_GET, []() {
    Serial.println("Received: /eyes2");
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/eyes3", HTTP_GET, []() {
    Serial.println("Received: /eyes3");
    server.send(200, "text/plain", "OK");
  });
  
  // Mode selections
  server.on("/mode1", HTTP_GET, []() {
    String value = server.arg("value");
    Serial.print("Received: /mode1?value=");
    Serial.println(value);
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/mode2", HTTP_GET, []() {
    String value = server.arg("value");
    Serial.print("Received: /mode2?value=");
    Serial.println(value);
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/mode3", HTTP_GET, []() {
    String value = server.arg("value");
    Serial.print("Received: /mode3?value=");
    Serial.println(value);
    server.send(200, "text/plain", "OK");
  });
  
  // Movement control
  server.on("/move", HTTP_GET, []() {
    String dir = server.arg("dir");
    Serial.print("Received: /move?dir=");
    Serial.println(dir);
    server.send(200, "text/plain", "OK");
  });
  
  // Speed control
  server.on("/speed", HTTP_GET, []() {
    String value = server.arg("value");
    Serial.print("Received: /speed?value=");
    Serial.println(value);
    server.send(200, "text/plain", "OK");
  });
  
  // Hand selection (Action page)
  server.on("/hand", HTTP_GET, []() {
    String value = server.arg("value");
    Serial.print("Received: /hand?value=");
    Serial.println(value);
    server.send(200, "text/plain", "OK");
  });
  
  // Body part position (Action page)
  server.on("/position", HTTP_GET, []() {
    String part = server.arg("part");
    String value = server.arg("value");
    String hand = server.arg("hand");
    Serial.print("Received: /position?part=");
    Serial.print(part);
    Serial.print("&value=");
    Serial.print(value);
    Serial.print("&hand=");
    Serial.println(hand);
    server.send(200, "text/plain", "OK");
  });
  
  // Home button (Action page)
  server.on("/home", HTTP_GET, []() {
    Serial.println("Received: /home");
    server.send(200, "text/plain", "OK");
  });
  
  // Save pose (Action page)
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
    
    Serial.print("Received: /save_pose?pos=");
    Serial.print(pos);
    Serial.print("&hand=");
    Serial.print(hand);
    Serial.print("&head=");
    Serial.print(head);
    Serial.print("&lateral=");
    Serial.print(lateral);
    Serial.print("&shoulder=");
    Serial.print(shoulder);
    Serial.print("&forearm=");
    Serial.print(forearm);
    Serial.print("&elbow=");
    Serial.print(elbow);
    Serial.print("&wrist=");
    Serial.print(wrist);
    Serial.print("&fingers=");
    Serial.println(fingers);
    
    server.send(200, "text/plain", "OK");
  });
  
  // Loop control (Action page)
  server.on("/loop_start", HTTP_GET, []() {
    Serial.println("Received: /loop_start");
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/loop_stop", HTTP_GET, []() {
    Serial.println("Received: /loop_stop");
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/loop_undo", HTTP_GET, []() {
    Serial.println("Received: /loop_undo");
    server.send(200, "text/plain", "OK");
  });
  
  server.on("/loop_delete", HTTP_GET, []() {
    Serial.println("Received: /loop_delete");
    server.send(200, "text/plain", "OK");
  });
  
  // Start server
  server.begin();
  Serial.println("HTTP server started");
  Serial.println("Ready to receive commands!\n");
}

void loop() {
  server.handleClient();
}
