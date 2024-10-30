import React, { useEffect, useState } from 'react';
import * as signalR from "@microsoft/signalr"

const Notifications = () => {
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6IntcIklkXCI6XCI1YTU3MjIzYS02ZTdkLTQwMWItYTE5ZS1iZjkyODJkYjY5ZmVcIixcIkVtYWlsXCI6XCJjdXN0b21lcjFAZ21haWwuY29tXCIsXCJMb2dpbk1ldGhvZFwiOlwiRGVmYXVsdFwiLFwiUm9sZVwiOlwiQ3VzdG9tZXJcIixcIlN0YXR1c1wiOlwiQWN0aXZlXCJ9IiwiVG9rZW5DbGFpbSI6IkZvclZlcmlmeU9ubHkiLCJuYmYiOjE3MzAzMDA3MzMsImV4cCI6MTczMDMwMjUzMywiaWF0IjoxNzMwMzAwNzMzLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUyNDYiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUyNDYifQ.0zUBU2TcFrGfhH0fbtgJmbjO6_xDZ4xflSbDDXXoa2U";
    const [connection, setConnection] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Create the SignalR connection
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`https://localhost:7046/notification/hub?access_token=${accessToken}`, { withCredentials: false })
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
