import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

const routingKey = "5.studentNoti";
const exchangeName = "test-exchange";
const webSocketPort = "15674";
const domainName = "kietpt.online"

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const headers = {
            login: 'myadmin', // Replace with your RabbitMQ username
            passcode: 'mypassword' // Replace with your RabbitMQ password
        };
        const client = new Client({
            brokerURL: `ws://${domainName}:${webSocketPort}/ws`,
            connectHeaders: headers,
            onConnect: () => {
                console.log('Connected to RabbitMQ');
                client.subscribe(`/exchange/${exchangeName}/${routingKey}`, message => {
                    console.log(`Received: ${message.body}`);

                    // Append new notifications to the state
                    setNotifications(prevNotifications => [
                        ...prevNotifications,
                        message.body
                    ]);
                }
                );
            },
            onStompError: (frame) => {
                const readableString = new TextDecoder().decode(frame.binaryBody);
                console.log('STOMP error', readableString);
            }
        });

        client.activate();
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
