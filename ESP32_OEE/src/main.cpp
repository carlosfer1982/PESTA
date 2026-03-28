#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <bounce2.h>

 /*
const char* ssid = "iPhone";
const char* password = "carlon12";
const char* mqtt_server = "172.20.10.3";
 */

// /*
const char* ssid = "NOS-6896";
const char* password = "FTM9W4Q2";
const char* mqtt_server = "192.168.1.225";
const char* topico_data = "cin/ro-11/data";
const char* topico_cmd = "cin/ro-11/cmd";


    // contagem de sensorEntrada com debouce não bloqueante
        static int lastSensorEntrada = HIGH;
        static unsigned long lastDebounceTimeEntrada = 0;
        const unsigned long debounceDelay = 50; // 50 ms de debounce    

        Bounce2::Button button_entrada = Bounce2::Button();
        Bounce2::Button button_saida = Bounce2::Button();
        

int entrada = 0;
int saida = 0;
int desperdicio = 0;

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

// Função de callback para mensagens MQTT recebidas
void callback(char* topic, byte* message, unsigned int length) {
    
    
    if (strcmp(topic, "cin/ro-11/cmd") == 0) {
    char msg[50];
    char payload[length + 1];
   
    Serial.print("A Mensagem chegou no tópico: [");
    Serial.print(topic);
    Serial.print("] ");
    
    // Converter a mensagem recebida para uma string
    for(unsigned int i = 0; i < length; i++) {
        payload[i] = (char)message[i];
    }
    Serial.println(payload);

    
    
        memcpy(msg, payload, length);
        msg[length] = '\0';

        if (strcmp(msg, "START") == 0) {
            //iniciar_producao();
                Serial.println("RECEBIDO COMANDO: START");
        }
        else if (strcmp(msg, "PAUSE") == 0) {
            //pausar_producao();
            Serial.println("RECEBIDO COMANDO: PAUSE");  
        }
        else if (strcmp(msg, "CANCEL") == 0) {
            //cancelar_producao();
            Serial.println("RECEBIDO COMANDO: CANCEL");
        }
    }    
    
    /*
    String payload; // Cria uma string para armazenar a mensagem recebida

    for (unsigned int i = 0; i < length; i++) {
        payload += (char)message[i];
    }
    Serial.println(payload);
    */
    /*
    if (String(topic) == "cin/ro-11/cmd") {
        // exemplo simples
        if (payload == "LED_ON") {
            digitalWrite(2, HIGH);
            Serial.println("LED ligado");
        } else if (payload == "LED_OFF") {
            digitalWrite(2, LOW);
            Serial.println("LED desligado");
        } else if (payload == "STATUS") {
            StaticJsonDocument<200> resp;
            resp["entrada"] = entrada;
            resp["saida"] = saida;
            resp["desperdicio"] = desperdicio;
            char buf[256];
            serializeJson(resp, buf);
            client.publish("cin/ro-11/data", buf);
            Serial.println("Status enviado");
        } else {
            Serial.println("Comando desconhecido em cin/ro-11/cmd");
        }
        */
}


// Função de configuração
void setup() {
    Serial.begin(115200);
    setup_wifi();
    client.setServer(mqtt_server, 1883);
    client.setCallback(callback);

    // Configurar 2 portos de entrada com pull-up interno
    pinMode(0, INPUT_PULLUP); // Entrada
    pinMode(4, INPUT_PULLUP); // Saída

    button_entrada.attach(0);
    button_entrada.interval(debounceDelay); // Configura o tempo de debounce para 50 ms
    button_saida.attach(4);
    button_saida.interval(debounceDelay); // Configura o tempo de debounce para 50 ms


    // Configura 1 led para indicar o estado do sistema
    pinMode(2, OUTPUT); // LED integrado do ESP32
    digitalWrite(2, HIGH); // Garante que o LED comece ligado
    delay(2000); // Aguarda um momento para indicar que o sistema está iniciando
}

// Função para reconectar ao MQTT caso a conexão seja perdida
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

    // Ler o estado dos sensores
    button_entrada.update();
    button_saida.update();
    
    //  Contagem de entrada com debounce não bloqueante
    if (button_entrada.fell()) {
        Serial.println("Sensor de entrada ativado");
        entrada++;
    }

    // Contagem de saída com debounce não bloqueante
    if (button_saida.fell()) {
        Serial.println("Sensor de saída ativado");
        saida++;
        //digitalWrite(2, HIGH); // Acende o LED para indicar atividade
    }
 
    // Envio de mensagem a cada 1 segundo
    static unsigned long lastMsgTime = 0;
    if (millis() - lastMsgTime > 1000) {
        lastMsgTime = millis();
        char buffer[256];
        StaticJsonDocument<200> doc;
        doc["entrada"] = entrada;
        doc["saida"] = saida;
        doc["desperdicio"] = entrada - saida; // Calcula o desperdício
        serializeJson(doc, buffer);
        client.publish(topico_data, buffer);
    }


}