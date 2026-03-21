const mqtt = require('mqtt');
const express = require('express'); // Importa a biblioteca express para criar servidores API
const bodyParser = require('body-parser');
const path = require('path'); // Módulo para lidar com caminhos de arquivos e diretórios

const app = express(); // Cria uma instância do Express - Servidor API
const port = 3000; 
//const mqttClient = mqtt.connect({ host: 'test.mosquitto.org', port: 1883 });
//const mqttClient = mqtt.connect({ host: '192.168.1.189', port: 1883 });
//const mqttClient = mqtt.connect({ host: '10.200.0.225', port: 1883 });
const mqttClient = mqtt.connect({ host: '172.20.10.3', port: 1883 });

app.use(bodyParser.json()); //  analisa automaticamente o corpo das requisições HTTP
//  que chegam no formato JSON, convertendo-o em um objeto JavaScript acessível via req.body. 
// Isso é útil para APIs que recebem dados JSON em POST/PUT requests.

// Configurações da base de dados
// Configurações para base de dados MongoDB
// URL do servidor local (padrão porta 27017)
const { MongoClient } = require("mongodb"); // Importa o cliente MongoDB para conectar ao banco de dados
const mongoose = require('mongoose'); // Importa o Mongoose para modelar os dados (não utilizado neste exemplo)
const baseDados = 'meuBanco'; // Nome do banco de dados que será utilizado
const colecao = 'meusDados'; // Nome da coleção que será utilizada (não utilizado neste exemplo)
const url = "mongodb://localhost:27017"; // URL de conexão com o MongoDB (padrão localhost na porta 27017)
const client = new MongoClient(url); //

let horaInicio = null; // Variável para armazenar o horário de início do processo
let lastData = {}; // cria uma variável vazia para armazenar o último dado recebido do microcontrolador


// Middleware para servir arquivos da pasta "public"
app.use(express.static(path.join(__dirname, 'public/v_final2'))); // Define o diretório "public" para servir arquivos estáticos (HTML, CSS, JS, imagens, etc.)
app.use(express.json()); // Permite que o servidor entenda JSON no corpo das requisições


// Realiza a conexão com o broker MQTT e se inscreve nos tópicos desejados
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('cin/#'); // Inscreve-se em todos os tópicos que começam com "cin/"
    console.log('Subscribed to topic: cin/#');


    /*
    mqttClient.subscribe('refrigerator/sensor1/temp');    
    mqttClient.subscribe('refrigerator/config');
    console.log('Subscribed to topics: ');
    console.log('refrigerator/sensor1/temp');
    console.log('refrigerator/config');
    */
    /*
    setInterval(() => {
        publishHardcodedData();
    }, 1000); 
    */
});

// Evento para lidar com mensagens recebidas nos tópicos inscritos
mqttClient.on('message', (topic, message) => {
    console.log('Mensagem recebida no tópico', topic, ':', message.toString());
    // Atualiza a variável lastData com os dados recebidos do microcontrolador
    if (topic.startsWith('cin/ro-11/data')) { // Verifica se a mensagem é do tópico de dados do microcontrolador
        try {
            lastData = JSON.parse(message.toString()); // Tenta converter a mensagem de string para objeto JSON e armazena em lastData
            //lastData = message.toString(); // Armazena a mensagem como string em lastData (sem parsear para JSON)
            console.log('Dados atualizados em lastData:', lastData); // Imprime os dados atualizados no console
        } catch (err) {
            console.error('Erro ao parsear mensagem JSON:', err); // Imprime um erro se a mensagem não puder ser convertida para JSON
        }   

      }
});

// Function to publish hardcoded data
function publishHardcodedData(topic,hardcodedData) {
    
    mqttClient.publish(topic, JSON.stringify(hardcodedData), (err) => {
        if (err) {
            console.error('Failed to publish hardcoded data', err);
        } else {
            console.log('Hardcoded data published successfully', JSON.stringify(hardcodedData));
        }
    });
}

async function gravar() {
  try{
    const db = client.db("meuBanco");
    const collection = db.collection("meusDados");
    await collection.insertOne(lastData);
    console.log('teste de gravação de dados');

  }
  catch(err) {
    console.error("Erro:", err);
  }

}

// Rota para fornecer os dados ao frontend
// O frontend pode fazer uma requisição GET para esta rota para obter os dados mais recentes
app.get('/api/micro/data', (req, res) => {
  res.json(lastData); // Retorna o último dado recebido do microcontrolador em formato JSON
  
});

app.post('/api/micro/cmd', (req, res) => {
  const { topico, cmd, OF , SETQ } = req.body; // Extrai os campos cmd, of e setq do corpo da requisição

  // Consigo parsear os dados recebidos do frontend e enviar para o microcontrolador via MQTT
  //console.log("Comando recebido:", cmd, OF, SETQ); // Imprime os valores recebidos no console

 console.log("📤 Dado recebido pelo frontend na api: api/micro/cmd: ", req.body);

if (topico &&cmd && OF && SETQ) {
  publishHardcodedData(topico, { cmd, OF, SETQ }); // Publica os dados no tópico 'cin/ro-11/cmd' do MQTT
  //console.log("Dados publicados no MQTT:", { cmd, OF, SETQ });
} else {
  console.error("Dados incompletos. Certifique-se de enviar cmd, OF e SETQ.");
  return res.status(400).json({ error: "Dados incompletos. Envie cmd, OF e SETQ." }); // Retorna um erro 400 se os dados estiverem incompletos
}


   res.status(201).json({
    success: true,
    message: 'Item enviado com sucesso!',
    data: req.body
  });

 
 
 /*
  const comando = JSON.stringify(req.body);
  const maxTentativas = 3;

  for (let i = 1; i <= maxTentativas; i++) {

    try {

      await new Promise((resolve, reject) => {

        serial.write(comando + '\n', err => {
          if (err) reject(err);
          else resolve();
        });

      });
      
      console.log("📤 Enviado:", comando);


    } catch (err) {

      console.log(`⚠️ Tentativa ${i} falhou`);

      if (i === maxTentativas) {
        return res.status(500).json({ error: "Falha ao enviar comando" });
      }

    }

  }
*/
});

app.post('/api/db/producao', async (req, res) => {
  try {
    await client.connect(); // Conecta ao MongoDB
    console.log("✅ Conectado ao MongoDB!");
    const db = client.db("meuBanco"); // Seleciona a base de dados
    const collection = db.collection("producao"); // Seleciona a coleção producao


    // Inserindo documento de produção
    await collection.insertOne(req.body); // Insere o documento recebido no corpo da requisição
    console.log(req.body);
    console.log("📌 Documento de produção inserido com sucesso!");
    res.json({ status: 'Documento inserido com sucesso' }); // Retorna uma resposta de sucesso
    lastData = {};  // Limpa o lastData após inserir o documento de produção

  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: 'Erro ao inserir documento' });
  } //finally { // manteve-se a conexão ativa 
    //await client.close();
    //console.log("✅ Conexão encerrada ao MongoDB!");
  //}
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});