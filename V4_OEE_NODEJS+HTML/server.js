// server.js

const express = require('express'); // Importa a biblioteca express para criar servidores API
const cors = require('cors');       // Importa a biblioteca CORS
const { SerialPort } = require('serialport'); // Importa a biblioteca para ler a porta serial
const { ReadlineParser } = require('@serialport/parser-readline');  // Importa o módulo de parsing por linha
const path = require('path');   // Importa a biblioteca que funcionar como interface para o endereço físico da porta (COM7)

const app = express();  // Cria uma instância do Express - Servidor API
// Configurações do servidor
app.use(express.json()); // Permite que o servidor entenda JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Permite que o servidor entenda dados de formulários URL-encoded
const port = 3000;  // Define a porta que o servidor irá escutar
// Configurações do CORS para permitir requisições de outros domínios
// Isso é útil se você estiver rodando o frontend em um domínio diferente do backend
app.use(cors()); // Contudo, acabei por juntar as duas aplicações no mesmo servidor, então não é mais necessário
// mantive, mas no futuro, se for necessário, pode ser removido



// Configurações da base de dados
// Configurações para base de dados MongoDB
// URL do servidor local (padrão porta 27017)
const { MongoClient } = require("mongodb"); // Importa o cliente MongoDB para conectar ao banco de dados
const mongoose = require('mongoose'); // Importa o Mongoose para modelar os dados (não utilizado neste exemplo)
const baseDados = 'meuBanco'; // Nome do banco de dados que será utilizado
const colecao = 'meusDados'; // Nome da coleção que será utilizada (não utilizado neste exemplo)
const url = "mongodb://localhost:27017"; // URL de conexão com o MongoDB (padrão localhost na porta 27017)
const client = new MongoClient(url); // Cria uma instância do cliente MongoDB com a URL de conexão

let horaInicio = null; // Variável para armazenar o horário de início do processo

// Função para gravar os dados recebidos na base de dados
// Esta função é chamada sempre que novos dados são recebidos pela porta serial
// Ela insere os dados na base de dados MongoDB na coleção meusDados
// A função é assíncrona para lidar com operações de I/O sem bloquear o servidor
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

// Função para conectar ao MongoDB e inserir um documento de teste
// Esta função é chamada quando o servidor inicia para garantir que a conexão com o banco de dados está funcionando
/* Usada apenas para teste inicial, depois não é mais necessária
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
  // finally {     // A base de dados não é encerrada para manter a conexão ativa ////
  //  await client.close();
  //  console.log("✅ Conexão encerrada ao MongoDB!");
  //}
}
*/

// Configuração da porta serial
const serial = new SerialPort({
  path: 'COM9',         //  Inserir neste path a porta correta onde o microcontrolador está conectado)
  baudRate: 38400    // Velocidade de comunicação (deve ser a mesma configurada no microcontrolador)
});

const parser = serial.pipe(new ReadlineParser({ delimiter: '\r\n' })); // Configura o parser para ler dados linha a linha, considerando '\r\n' como final de linha  


let lastData = {}; // cria uma variável vazia para armazenar o último dado recebido do microcontrolador

// Quando receber dados pela porta serial
parser.on('data', data => {
  try {
    const json = JSON.parse(data); // Espera JSON vindo do microcontrolador
    const timestamp = new Date().toLocaleString(); // Adiciona um timestamp ao dado recebido
    //run();
    gravar(); // Chama a função para gravar os dados na base de dados, ou seja, a cada dado recebido, ele é gravado na coleção meusDados
    // A cada segundo ou 2 segundos, de acordo com o envio do microcontrolador, o dado é atualizado

    lastData = { timestamp, ...json }; // Atualiza o último dado recebido, adicionando o timestamp
    console.log('📥 Recebido:', lastData);  // Verificação dos dados recebidos no console, já com o timestamp adicionado
    console.log('Dado Recebido da base de dados:' );

  } catch (e) {
    console.error('❌ Erro ao parsear JSON:', e); // Se o dado não for um JSON válido, exibe um erro no console
  }
});

// Middleware para servir arquivos da pasta "public"
app.use(express.static(path.join(__dirname, 'public'))); // Define o diretório "public" para servir arquivos estáticos (HTML, CSS, JS, imagens, etc.)
app.use(express.json()); // Permite que o servidor entenda JSON no corpo das requisições

// Rota para fornecer os dados ao frontend
// O frontend pode fazer uma requisição GET para esta rota para obter os dados mais recentes
app.get('/api/micro/data', (req, res) => {
  res.json(lastData); // Retorna o último dado recebido do microcontrolador em formato JSON
  
});

// Rota para envio de comandos ao microcontrolador
// O frontend pode fazer uma requisição POST para esta rota para enviar comandos
app.post('/api/micro/cmd', (req, res) => {
  const comando = JSON.stringify(req.body); // Converte o corpo da requisição em uma string JSON (função síncrona)
  // Envia o comando para o microcontrolador pela porta serial
  serial.write(comando + '\n', err => {
    if (err) {
      console.error('Erro ao enviar comando:', err);
      return res.status(500).json({ error: 'Erro ao enviar comando' }); // Retorna um erro 500 se houver falha ao enviar o comando
    }
    console.log('📤 Enviado:', comando); 
    res.json({ status: 'ok' }); // Retorna uma resposta de sucesso
  });
});
// Observação: 
// As duas rotas propostas acima são exemplos básicos. Poderiam ser tratadas como apenas uma rota com métodos GET e POST, 
// mas optei por separar para maior clareza entre as funcionalidades de leitura e escrita.

// Rota para criar registo na base de dados
// O frontend pode fazer uma requisição POST para esta rota para criar um novo documento na coleção producao
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
// Cria Registo na base de dados





// Inicia o servidor
// O servidor começa a escutar na porta definida (3000)
// Quando o servidor inicia, chama a função run() para conectar ao MongoDB
// e exibe uma mensagem no console com o endereço do servidor
app.listen(port, () => {
  //run();
  console.log(`✅ Servidor rodando em: http://localhost:${port}`);
});
