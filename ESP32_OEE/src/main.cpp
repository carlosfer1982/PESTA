#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

 /*
const char* ssid = "iPhone";
const char* password = "carlon12";
const char* mqtt_server = "172.20.10.3";
 */

// /*
const char* ssid = "NOS-6896";
const char* password = "FTM9W4Q2";
const char* mqtt_server = "192.168.1.172";
// */
WiFiClient espClient;
PubSubClient client(espClient);


void setup_wifi() {
    delay(10);
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    for (unsigned int i = 0; i < length; i++) {
        Serial.print((char)message[i]);
    }
    Serial.println();
}



void setup() {
    Serial.begin(115200);
    setup_wifi();
    client.setServer(mqtt_server, 1883);
    client.setCallback(callback);
}


void reconnect() {
    while (!client.connected()) {
        Serial.print("Attempting MQTT connection...");
        String clientId = "ESP32Client-";
        clientId += String(random(0xffff), HEX); // Add a unique identifier to the client ID
        if (client.connect(clientId.c_str())) {
            Serial.println("connected");
            client.subscribe("cin/ro-11/cmd");
            client.subscribe("cin/ro-11/data");

        } else {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            delay(1000);
        }
    }
}

void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();

    // Publish temperature data
    StaticJsonDocument<200> doc;
    doc["temperature"] = random(20, 30);
    char buffer[256];
    serializeJson(doc, buffer);
    client.publish("refrigerator/sensor1/temp", buffer);

    delay(2000);
}