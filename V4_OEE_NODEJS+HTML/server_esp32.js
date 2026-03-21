const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const httpPort = 3000; 
//const mqttClient = mqtt.connect({ host: 'test.mosquitto.org', port: 1883 });
//const mqttClient = mqtt.connect({ host: '192.168.1.172', port: 1883 });
const mqttClient = mqtt.connect({ host: '10.200.0.225', port: 1883 });

app.use(bodyParser.json());


mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('refrigerator/sensor1/temp');
    mqttClient.subscribe('refrigerator/config');
    
    setInterval(() => {
        publishHardcodedData();
    }, 1000); 
});

mqttClient.on('message', (topic, message) => {
    console.log('Mensagem recebida no tópico', topic, ':', message.toString());
});

// Function to publish hardcoded data
function publishHardcodedData() {
    const hardcodedData = { "threshold": 25 };
    mqttClient.publish('refrigerator/config', JSON.stringify(hardcodedData), (err) => {
        if (err) {
            console.error('Failed to publish hardcoded data', err);
        } else {
            console.log('Hardcoded data published successfully', JSON.stringify(hardcodedData));
        }
    });
}

// Start the server
app.listen(httpPort, () => {
    console.log(`Server is running on http://localhost:${httpPort}`);
});