import React, { useEffect, useState } from 'react';
import * as signalR from "@microsoft/signalr"

const Notifications = () => {
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6IntcIklkXCI6XCI1YTU3MjIzYS02ZTdkLTQwMWItYTE5ZS1iZjkyODJkYjY5ZmVcIixcIkVtYWlsXCI6XCJjdXN0b21lcjFAZ21haWwuY29tXCIsXCJMb2dpbk1ldGhvZFwiOlwiRGVmYXVsdFwiLFwiUm9sZVwiOlwiQ3VzdG9tZXJcIixcIlN0YXR1c1wiOlwiQWN0aXZlXCJ9IiwiVG9rZW5DbGFpbSI6IkZvclZlcmlmeU9ubHkiLCJuYmYiOjE3MzAzNTkyNjUsImV4cCI6MTczMDM2MTA2NSwiaWF0IjoxNzMwMzU5MjY1LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUyNDYiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUyNDYifQ.SLlmrOTiplZCx3__rdLb6vrN655UCWrhcKA0eDPD5BU";
    const [connection, setConnection] = useState(null);
    const [message, setMessage] = useState('');
    const [message2, setMessage2] = useState('');

    useEffect(() => {
        // Create the SignalR connection
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`https://tech-gadgets-dev.xyz/notification/hub?access_token=${accessToken}`, {
                withCredentials: false
            })
            .withAutomaticReconnect()
            .build();

        // Start the connection
        newConnection.start()
            .then(() => {
                console.log('SignalR Connected!');
                // Call the restricted method "SendMessage"
                newConnection.invoke("JoinGroup", "CustomerGroup")
                    .then(() => console.log("JoinGroup method invoked successfully"))
                    .catch(err => console.error("Error invoking JoinGroup method:", err));
                newConnection.on('GroupMethod', (user, receivedMessage) => {
                    setMessage(`${user}: ${receivedMessage}`);
                });
                // Call the restricted method "PersonalMessage"
                newConnection.on('PersonalMethod', (user, receivedMessage) => {
                    setMessage2(`${user}: ${receivedMessage}`);
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
            <p>Group: {message}</p>
            <p>Personal: {message2}</p>
        </div>
    );
};

export default Notifications;
