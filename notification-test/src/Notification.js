import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

const routingKey = "studentNoti";
const exchangeName = "test-exchange";
const webSocketPort = "15674";
const domainName = "kietpt.online"

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    let client;

    useEffect(() => {
        const headers = {
            login: 'myadmin', // Replace with your RabbitMQ username
            passcode: 'mypassword' // Replace with your RabbitMQ password
        };
        client = new Client({
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
            },
            appendMissingNULLonIncoming: true,
            forceBinaryWSFrames: true
        });

        client.activate();

        return () => {
            if (client) {
                console.log("Disconnecting from RabbitMQ");
                client.deactivate(); // Properly deactivate the client on component unmount
            }
        };
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
