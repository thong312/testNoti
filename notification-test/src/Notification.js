import React, { useEffect, useState } from 'react';
// import { Connection } from 'rabbitmq-client';
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    // useEffect(() => {
    //     const rabbit = new Connection('amqp://myadmin:mypassword@kietpt.online:5672');

    //     rabbit.on('error', (err) => {
    //         console.log('RabbitMQ connection error', err);
    //     });

    //     rabbit.on('connection', () => {
    //         console.log('Connection successfully (re)established');
    //     });

    //     const setupRabbitMQ = async () => {
    //         try {
    //             const sub = rabbit.createConsumer({
    //                 queueOptions: { durable: true, autoDelete: true },
    //                 qos: { prefetchCount: 2 },
    //                 exchanges: [{ exchange: 'test-exchange', type: 'topic' }],
    //                 queueBindings: [{ exchange: 'test-exchange', routingKey: '5.studentNoti' }],
    //             }, async (msg) => {
    //                 const message = msg.body.toString("utf-8");
    //                 setNotifications(prev => [...prev, message]);
    //                 console.log('received message (user-events)', message);
    //             });

    //             sub.on('error', (err) => {
    //                 console.log('consumer error (user-events)', err);
    //             });

    //             return () => {
    //                 sub.close();
    //                 rabbit.close();
    //             };

    //         } catch (error) {
    //             console.error('Error in RabbitMQ setup:', error);
    //             rabbit.close();
    //         }
    //     };

    //     setupRabbitMQ();

    //     return () => {
    //         rabbit.close();
    //     };
    // }, []);
    useEffect(() => {
        const socket = new SockJS('http://kietpt.online:15672/ws', null, {
            transports: ['websocket'],
            // Disable XHR Polling and other fallback transports
            // transports: ['websocket', 'xhr-streaming', 'xhr-polling'] // Use this if you want to allow fallbacks
        });

        const stompClient = Stomp.over(socket);

        stompClient.connect({}, function (frame) {
            // Create a Stomp client
            const client = new Client({
                webSocketFactory: () => socket,
                connectHeaders: {
                    login: 'myadmin',
                    passcode: 'mypassword',
                },
                debug: (msg) => console.log(msg),
                onConnect: () => {
                    console.log('Connected to RabbitMQ');
                    client.subscribe('/exchange/test-exchange/5.studentNoti', (message) => {
                        if (message.body) {
                            setNotifications(prev => [...prev, message.body]);
                        }
                    });
                },
                onDisconnect: () => {
                    console.log('Disconnected from RabbitMQ');
                },
                onStompError: (frame) => {
                    console.error('Broker reported error', frame);
                },
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                reconnectDelay: 5000
            });

            client.activate();

            return () => {
                client.deactivate();
            };
        }, function (error) {
            console.log('STOMP error', error);
        });
    }, []);

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>{notification}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
