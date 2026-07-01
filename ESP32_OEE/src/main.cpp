#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h> // https://arduinojson.org/v7/tutorial/deserialization/
#include <bounce2.h>


                        // https://docs.arduino.cc/libraries/wifimanager/
                        // https://github.com/tzapu/wifimanager#how-it-works
                        // https://www.mongodb.com/pt-br/docs/manual/crud/
                        // https://cloud.mongodb.com/v2/69a09eb39be65a9744fd7702#/explorer/69a09f6b78b72a1037369573/meuBanco/producao/find


 
 
                        /*
const char* ssid = "iPhone";
const char* password = "carlon12";
const char* mqtt_server = "172.20.10.3";
 */

// /*

// Servidor MQTT
//const char* mqtt_server = "192.168.1.225";
const char* mqtt_server = "test.mosquitto.org";


// Rede Wi-fi
// CIN - Rede 1 - usar a biblioteca "esp_wpa2.h"
// const char* ssid = "CIN";
// const char* password = "FTM9W4Q2";

// Casa - Rede 2
const char* ssid = "NOS-6896";
const char* password = "FTM9W4Q2";

//Telemovel - Rede 3
//const char* ssid = "iPhone";
//const char* password = "carlon12";

//Telemovel - Rede 4
//const char* ssid = "IS930-carlos";
//const char* password = "carlon12";


// Topicos MQTT
const char* topico_data = "cin/ro-11/data";
const char* topico_cmd = "cin/ro-11/cmd";

int interval = 1000; // Intervalo de envio de dados em milissegundos

// Classe para gerenciar dados
class esp32 {
private:    
    String esp32_id;
    String mqtt_server;
    String topico_data;
    String topico_cmd;
    String status;
    String cmd;
    int setq;
    String of;
    int entrada;
    int saida;
    int desperdicio;

public:
    esp32(String id, String mqtt_server, String topico_data, String topico_cmd) {
        this->esp32_id = id;
        this->mqtt_server = mqtt_server;
        this->topico_data = topico_data;
        this->topico_cmd = topico_cmd;
        this->status = "desconectado";
        this->cmd = "";
        this->setq = 0;
        this->of = "";
        this->entrada = 0;
        this->saida = 0;
        this->desperdicio = 0;
    }

    void setStatus(String status) {
        this->status = status;
    }

    void setCmd(String cmd) {
        this->cmd = cmd;
    }

    void setSetq(int setq) {
        this->setq = setq;
    }

    void setOf(String of) {
        this->of = of;
    }

    void setEntrada(int entrada) {
        this->entrada = entrada;
    }

    void setSaida(int saida) {
        this->saida = saida;
    }

    void setDesperdicio(int desperdicio) {
        this->desperdicio = desperdicio;
    }

    void toJson(JsonDocument& doc) {
        JsonObject object = doc.to<JsonObject>();
        object["esp32_id"] = "ro-11";
        object["mqtt_server"] = mqtt_server;
        object["topico_data"] = topico_data;
        object["topico_cmd"] = topico_cmd;
        object["status"] = status;
        object["cmd"] = cmd;
        object["setq"] = setq;
        object["of"] = of;
        object["entrada"] = entrada;
        object["saida"] = saida;
        object["desperdicio"] = desperdicio;
    }

    void reset() {
        this->status = "desconectado";
        this->cmd = "";
        this->setq = 0;
        this->of = "";
        this->entrada = 0;
        this->saida = 0;
        this->desperdicio = 0;
    }


};

esp32 esp32_obj("ro-11", "test.mosquitto.org", "cin/ro-11/data", "cin/ro-11/cmd");


// Criando um objeto JasonDocument para armazenar os dados a serem enviados
JsonDocument doc2;
JsonDocument esp32_doc;



    // contagem de sensorEntrada com debouce não bloqueante
        static int lastSensorEntrada = HIGH;
        static unsigned long lastDebounceTimeEntrada = 0;
        const unsigned long debounceDelay = 50; // 50 ms de debounce    

        Bounce2::Button button_entrada = Bounce2::Button();
        Bounce2::Button button_saida = Bounce2::Button();
        

int entrada = 0;
int saida = 0;
int desperdicio = 0;

// Criação do objeto JSON para armazenar os dados a serem enviados
JsonObject object = doc2.to<JsonObject>();
WiFiClient espClient;
PubSubClient client(espClient);


void calculaDesperdicio(int entrada, int saida) {
    object["desperdicio"] = entrada - saida; // Calcula o desperdício
}  

void enviaStatus(int interval) {
    static unsigned long lastMsgTime = 0;
    if (millis() - lastMsgTime > interval) {
        lastMsgTime = millis();

            //char buffer[256];
            //serializeJson(doc2, Serial); // Imprime o JSON no monitor serial para verificação
            //Serial.println();               // Pula uma linha para melhor leitura no monitor serial            
            //serializeJson(doc2, buffer);    // Serializa o objeto JSON para o buffer
            //client.publish(topico_data, buffer); // Publica a mensagem no tópico MQTT
            esp32_obj.toJson(esp32_doc); // Serializa o objeto esp32_obj para o objeto JSON esp32_doc

            char buffer[256];
            serializeJson(esp32_doc, Serial); // Imprime o JSON no monitor serial para verificação
            Serial.println();               // Pula uma linha para melhor leitura no monitor serial
            serializeJson(esp32_doc, buffer);    // Serializa o objeto JSON para o buffer
            client.publish(topico_data, buffer); // Publica a mensagem no tópico MQTT

    }
}

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
    
// Deserialização da mensagem recebida para um objeto JSON
    DeserializationError error = deserializeJson(doc2, message, length); // Deserializa a mensagem recebida para o objeto JSON doc2
    // Verifica Erros
    if (error) {    // Verifica se houve erro na deserialização
        Serial.print("Falha na deserialização da mensagem: ");
        Serial.println(error.c_str());
        return;
    }


    }

    // Extract values from the JSON object
    //char *cmd = object["cmd"]; // Extrai o valor do campo "cmd" do objeto JSON
    //int setq = object["setq"]; // Extrai o valor do campo "setq" do objeto JSON
    //char *of = object["of"];   // Extrai o valor do campo "of" do objeto JSON


    /*
    // Converter a mensagem recebida para uma string
    for(unsigned int i = 0; i < length; i++) {
        payload[i] = (char)message[i];
    }
    Serial.println(payload);

    
    //  Verificação do CMD recebido e atualização do objeto JSON
        memcpy(msg, payload, length);
        msg[length] = '\0';

        if (strcmp(msg, "START") == 0) {
            //iniciar_producao();
                Serial.println("RECEBIDO COMANDO: START");
                object["cmd"] = "START"; // Atualiza o comando no objeto JSON
                
        }
        else if (strcmp(msg, "PAUSE") == 0) {
            //pausar_producao();
            Serial.println("RECEBIDO COMANDO: PAUSE"); 
            object["cmd"] = "PAUSE"; // Atualiza o comando no objeto JSON    
        }
        else if (strcmp(msg, "CANCEL") == 0) {
            //cancelar_producao();
            Serial.println("RECEBIDO COMANDO: CANCEL");
            object["cmd"] = "CANCEL"; // Atualiza o comando no objeto JSON
        }
    }    
    */

}


// Função de configuração
void setup() {
    Serial.begin(115200);
    setup_wifi();
    client.setServer(mqtt_server, 1883);
    client.setCallback(callback);

    esp32_obj.setStatus("contectado ");
    esp32_obj.setCmd("START");
    esp32_obj.setSetq(1);
    esp32_obj.setOf("OF-001");

    esp32_obj.toJson(esp32_doc); // Serializa o objeto esp32_obj para o objeto JSON esp32_doc
    serializeJson(esp32_doc, Serial); // Imprime o objeto JSON esp32_doc no monitor serial para verificação
    
    Serial.println();
    Serial.println("Iniciando o sistema...");
    Serial.println();
    
    serializeJson(esp32_doc, Serial);
    Serial.println();





    // Teste de envio de mensagem de um objeto JSON
    // Criando um objeto
    //object = doc2.to<JsonObject>();
    object["entrada"] = 0;
    object["saida"] = 0;
    object["desperdicio"] = 0;
    object["of"] = 0;
    object["setq"] = 0;
    object["cmd"] = "";

    Serial.println();
    serializeJson(doc2, Serial);
    Serial.println();

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


// Função de loop principal
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
        entrada++;
        Serial.printf("Sensor de entrada ativado %d \n", entrada);
        esp32_obj.setEntrada(entrada); // Atualiza o valor de entrada no objeto esp32_obj
        
        object["entrada"] = entrada;    // Atualiza o valor de entrada no objeto JSON
        calculaDesperdicio(entrada, saida); // Atualiza o valor de desperdício no objeto JSON
       
    }

    // Contagem de saída com debounce não bloqueante
    if (button_saida.fell()) {
        saida++;
        Serial.printf("Contagem de saída: %d \n", saida);
        esp32_obj.setSaida(saida); // Atualiza o valor de saída no objeto esp32_obj 

        object["saida"] = saida;    // Atualiza o valor de saída no objeto JSON
        calculaDesperdicio(entrada, saida); // Atualiza o valor de desperdício no objeto JSON
        
    }
 
    
    
    if (  (strcmp(object["cmd"], "START") == 0))
             {
        enviaStatus(interval);
    }
    else if (strcmp(object["cmd"], "PAUSE") == 0) {
        // Pausa o envio de mensagens, mantendo o sistema atualizado localmente
    }
    else if (strcmp(object["cmd"], "CANCEL") == 0) {
        // Cancela a produção, reseta os contadores e envia o status atualizado
        entrada = 0;
        saida = 0;
        desperdicio = 0;
        object["entrada"] = entrada;
        object["saida"] = saida;
        object["desperdicio"] = desperdicio;
        esp32_obj.reset(); // Reseta o objeto esp32_obj
        Serial.println("Status atualizado após o reset");
    }
    // Envio de mensagem a cada 1 segundo
   

    
}