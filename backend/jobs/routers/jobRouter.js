const router = require('express').Router();
const RabbitMQ = require('../rabbitMQ/rabbitmq.js');

// const db = require('../db/db.js');

router.get('/', async (req, res) => {
    console.log('GET request to the homepage');
    
    // Get a random message
    const message = 'getRandomMessage()';
    
    try {
        // Send the message to RabbitMQ
        await rabbitmq.send("hello-nodejs-stream", message);  // Use the correct stream name

        console.log("Message sent:", message);
        res.send(`Random message sent to RabbitMQ: ${message}`);
    } catch (error) {
        console.error("Error while sending message to RabbitMQ:", error);
        res.status(500).send("Error while sending message to RabbitMQ.");
    } finally {
        // Close RabbitMQ connection if necessary
        await rabbitmq.close();
    }
});

router.post('/', (req, res) => {
    console.log('POST request to the homepage')
    res.send('POST request to the homepage')
});

// create a route to post a job to actual database


module.exports = router;