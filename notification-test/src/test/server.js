const amqp = require('amqplib');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const rabbitUrl = 'amqp://myadmin:mypassword@kietpt.online:5672';
const queue = '5.studentNoti';

async function setupRabbitMQ() {
    const conn = await amqp.connect(rabbitUrl);
    const channel = await conn.createChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, (msg) => {
        if (msg !== null) {
            const message = msg.content.toString();
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
            channel.ack(msg);
        }
    });
}

setupRabbitMQ().catch(console.error);

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
