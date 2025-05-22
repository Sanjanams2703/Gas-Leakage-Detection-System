#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// Wi-Fi credentials
const char* ssid = "THARUN";
const char* password = "12345678";

// Server endpoint
const char* serverUrl = "http://192.168.120.244:3000/api/sensor";

// Sensor Pins
#define MQ4_PIN 34         
#define DHT_PIN 22          
#define DHT_TYPE DHT11     

// Initialize the DHT sensor
DHT dht(DHT_PIN, DHT_TYPE);

// Variables for sensor data
float temperature = 0.0;
int gasLevel = 0;

void setup() {
  Serial.begin(115200);
  WiFi.disconnect(true);  
  delay(1000);

  dht.begin();
  pinMode(MQ4_PIN, INPUT);

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    temperature = dht.readTemperature();
    gasLevel = analogRead(MQ4_PIN);

    Serial.println("Sensor Readings:");
    Serial.printf("Temperature: %.2f\n", temperature);
    Serial.printf("Gas Level: %d\n", gasLevel);

    if (temperature < 0 || temperature > 35) {
      Serial.println("Warning: Temperature out of range!");
    }

    if (gasLevel > 4000) { 
      Serial.println("Warning: High gas concentration detected!");
    }

    // Send data to server
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonData = String("{\"temperature\":") + temperature + ",\"gasLevel\":" + gasLevel + "}";
    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      Serial.printf("Data sent successfully: %d\n", httpResponseCode);
    } else {
      Serial.printf("Failed to send data: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();

  } else {
    Serial.println("WiFi not connected. Retrying...");
    WiFi.reconnect();
  }

  delay(5000); 
}
