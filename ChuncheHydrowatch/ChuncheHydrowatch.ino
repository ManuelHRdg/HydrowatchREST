#include <Arduino.h>
#ifdef ESP32
#include <WiFi.h>
#include <PubSubClient.h>
#include <AsyncTCP.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#endif
#include <ESPAsyncWebSrv.h>
#include <ArduinoJson.h>


const char* ssid="Manu S21";
const char* password="xapp6304";
const char* chunche="ManuManito";
const char* mqtt_server = "broker.hivemq.com";
AsyncWebServer server(80);

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE	(50)
char msg[MSG_BUFFER_SIZE];
int value = 0;

const int pingPin = 13; //D19
int inPin = 12; //D18
//int led = 23; //D23


void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character
  if ((char)payload[0] == '1') {
    //digitalWrite(2, LOW);   // Turn the LED on (Note that LOW is the voltage level
    // but actually the LED is on; this is because
    // it is active low on the ESP-01)
  } else {
    //digitalWrite(2, HIGH);  // Turn the LED off by making the voltage HIGH
  }

}


void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "Chunche-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("outTopic", "Hola");
      // ... and resubscribe
      client.subscribe("inTopic");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
 
void setup() {
  pinMode(2, OUTPUT);
  digitalWrite(2, LOW);
  Serial.begin(9600);
  conectarse();
  server.on("/medicion", HTTP_GET,[](AsyncWebServerRequest *r){
    Serial.print("request recibido");
    AsyncResponseStream *response = r->beginResponseStream("application/json");    
    DynamicJsonDocument json(1024);
    long duration, cm;
    pinMode(inPin, INPUT);
    duration = pulseIn(inPin, HIGH);
    cm = microsecondsToCentimeters(duration);
    Serial.print(cm);
    json["chunche"] = String(chunche);
    json["diferencia"] = cm;
    serializeJson(json, *response);
    r->send(response);
  });

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");

  server.begin();

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);  
}
 
void loop()
{
long duration, cm;
 
pinMode(pingPin, OUTPUT);
 
 
digitalWrite(pingPin, LOW);
delayMicroseconds(2);
digitalWrite(pingPin, HIGH);
delayMicroseconds(5);
digitalWrite(pingPin, LOW);
pinMode(inPin, INPUT);
duration = pulseIn(inPin, HIGH);
 
cm = microsecondsToCentimeters(duration);
 
//Serial.print(cm);
//Serial.print("cm");
//Serial.println();
if (cm < 10) {
    digitalWrite(2, HIGH);
  }
  else {
    digitalWrite(2, LOW);
  }
delay(100);

if (!client.connected()) {
    reconnect();
  }
  client.loop();

  char Json_string[256];
  DynamicJsonDocument json(1024);
  //Serial.print(cm);
  json["tanqueName"] = String(chunche);
  json["nivel"] = cm;
  serializeJson(json, Json_string);

unsigned long now = millis();
  if (now - lastMsg > 60000) {
    lastMsg = now;
    ++value;
    snprintf (Json_string, MSG_BUFFER_SIZE, Json_string, value);
    Serial.print("Publish message: ");
    Serial.println(Json_string);
    client.publish("Niveles", Json_string);
  }

}
 
long microsecondsToCentimeters(long microseconds)
{
// The speed of sound is 340 m/s or 29 microseconds per centimeter.
// The ping travels out and back, so to find the distance of the
// object we take half of the distance travelled.
return microseconds / 29 / 2;
}


void conectarse(){
    Serial.print("Conectando");
    Serial.println(ssid);
    WiFi.begin(ssid,password);
    while(WiFi.status() != WL_CONNECTED){
      delay(500);
      Serial.print(".");      
    }
    Serial.print(WiFi.localIP());
  }
