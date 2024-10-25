const router = require('express').Router();
const RabbitMQ = require('../rabbitMQ/rabbitmq');  // Import your RabbitMQ class

// Create an instance of RabbitMQ
const rabbitmq = new RabbitMQ({
    hostname: "rabbitmq", // Replace with actual hostname or environment variable
    port: 5552,
    username: "rabbitmq",
    password: "rabbitmq"
});

// GET route to receive a message from RabbitMQ
router.get('/', async (req, res) => {
    console.log('GET request to the homepage');
    
    try {
        // Connect to RabbitMQ
        await rabbitmq.connect();

        // Declare a consumer to listen for messages on the specified stream
        const receivedMessage = await new Promise((resolve, reject) => {
            rabbitmq.connection.declareConsumer({
                stream: "hello-nodejs-stream",  // Make sure this matches the stream name
                messageHandler: (message) => {
                    // Convert message buffer to a string and resolve it
                    const msgContent = message.content.toString();
                    console.log("Received message from RabbitMQ:", msgContent);
                    resolve(msgContent); // Pass the message content to the response
                },
                errorHandler: (err) => {
                    console.error("Error while receiving message:", err);
                    reject(err);
                }
            });
        });

        // Send the received message as a response
        res.send(`Received message from RabbitMQ: ${receivedMessage}`);
    } catch (error) {
        console.error("Error while receiving message from RabbitMQ:", error);
        res.status(500).send("Error while receiving message from RabbitMQ.");
    } finally {
        // Close RabbitMQ connection if necessary
        await rabbitmq.close();
    }
});

// Export the router
module.exports = router;
