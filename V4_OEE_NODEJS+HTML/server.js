// server.js
//const mongoose = require('mongoose')
const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const path = require('path');

const app = express();
const port = 3000;
app.use(cors());


// Configurações da base de dados
// Configurações para base de dados MongoDB
// URL do servidor local (padrão porta 27017)
const { MongoClient } = require("mongodb");
const baseDados = 'meuBanco';
const colecao = 'meusDados';
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

let horaInicio = null;


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


async function run() {
  try {
    await client.connect();
    console.log("✅ Conectado ao MongoDB!");

    const db = client.db("meuBanco");
    const collection = db.collection("meusDados");

    // Inserindo documento de teste
    //await collection.insertOne(lastData);
    //console.log(lastData);  
    //console.log("📌 TESTE ******* Documento inserido com sucesso!");

  } catch (err) {
    console.error("Erro:", err);
  }
  // finally {
  //  await client.close();
  //  console.log("✅ Conexão encerrada ao MongoDB!");
  //}
}



async function run() {
  try {
    await client.connect();
    console.log("✅ Conectado ao MongoDB!");

    const db = client.db("meuBanco");
    const collection = db.collection("meusDados");

    // Inserindo documento de teste
    //await collection.insertOne(lastData);
    //console.log(lastData);  
    //console.log("📌 TESTE ******* Documento inserido com sucesso!");

  } catch (err) {
    console.error("Erro:", err);
  }
  // finally {
  //  await client.close();
  //  console.log("✅ Conexão encerrada ao MongoDB!");
  //}
}




// Configuração da porta serial
const serial = new SerialPort({
  path: 'COM7',         // 🔧 Altere para sua porta (ex: 'COM5' no Windows ou '/dev/ttyUSB0' no Linux)
  baudRate: 38400
});

const parser = serial.pipe(new ReadlineParser({ delimiter: '\r\n' }));

let lastData = {}; // Armazena o último dado recebido do microcontrolador

// Quando receber dados pela porta serial
parser.on('data', data => {
  try {
    const json = JSON.parse(data); // Espera JSON vindo do microcontrolador
    const timestamp = new Date().toISOString();
    //run();
    gravar();

    lastData = { timestamp, ...json };
    console.log('📥 Recebido:', lastData);
    console.log('Dado Recebido da base de dados:' );

  } catch (e) {
    console.error('❌ Erro ao parsear JSON:', e);
  }
});

// Middleware para servir arquivos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rota para fornecer os dados ao frontend
app.get('/api/micro/data', (req, res) => {
  res.json(lastData);
  //lastData = {};
});

// Rota para envio de comandos ao microcontrolador
app.post('/api/micro/cmd', (req, res) => {
  const comando = JSON.stringify(req.body);
  serial.write(comando + '\n', err => {
    if (err) {
      console.error('Erro ao enviar comando:', err);
      return res.status(500).json({ error: 'Erro ao enviar comando' });
    }
    console.log('📤 Enviado:', comando);
    res.json({ status: 'ok' });
  });
});


app.post('/api/db/producao', async (req, res) => {
  try {
    await client.connect();
    console.log("✅ Conectado ao MongoDB!");
    const db = client.db("meuBanco");
    const collection = db.collection("producao");


    // Inserindo documento de produção
    await collection.insertOne(req.body);
    console.log(req.body);
    console.log("📌 Documento de produção inserido com sucesso!");
    res.json({ status: 'Documento inserido com sucesso' });
    lastData = {};

  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: 'Erro ao inserir documento' });
  } //finally {
    //await client.close();
    //console.log("✅ Conexão encerrada ao MongoDB!");
  //}
});
// Cria Registo na base de dados





// Inicia o servidor
app.listen(port, () => {
  run();
  console.log(`✅ Servidor rodando em: http://localhost:${port}`);
});
