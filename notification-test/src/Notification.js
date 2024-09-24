import React, { useEffect, useState } from 'react';
import * as signalR from "@microsoft/signalr"

const Notifications = () => {
    const [connection, setConnection] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Create the SignalR connection
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://whateat-demo.xyz/noti-hub', { withCredentials: false })
            .withAutomaticReconnect()
            .build();

        // Start the connection
        newConnection.start()
            .then(() => {
                console.log('SignalR Connected!');
                // You can send a message to the server here if needed
                newConnection.on('ReceiveMessage', (user, receivedMessage) => {
                    setMessage(`${user}: ${receivedMessage}`);
                });
            })
            .catch(err => console.log('SignalR Connection Error: ', err));

        setConnection(newConnection);

        // Cleanup the connection when component unmounts
        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, []);

    return (
        <div>
            <h1>SignalR Messages</h1>
            <p>{message}</p>
        </div>
    );
};

export default Notifications;
