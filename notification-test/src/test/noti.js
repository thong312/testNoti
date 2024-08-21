import React, { useEffect, useState } from 'react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080'); // Use your WebSocket server URL

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            const message = event.data;
            setNotifications(prev => [...prev, message]);
            console.log('Received message:', message);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close();
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
