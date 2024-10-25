const { Client } = require("rabbitmq-stream-js-client");

class RabbitMQ {
    constructor(config = {}) {
        // Default configurations can be overridden by passing an argument
        this.config = {
            hostname: config.hostname || "localhost",
            port: config.port || 5552,
            username: config.username || "rabbitmq",
            password: config.password || "rabbitmq",
            vhost: config.vhost || "/",
        };

        this._client = new Client();
        this.connection = null;
    }

    // Method to connect to RabbitMQ
    async connect() {
        if (!this.connection) {
            console.log("Connecting to RabbitMQ...");
            try {
                this.connection = await this._client.connect(this.config);
                console.log("Connected to RabbitMQ.");
            } catch (error) {
                console.error("Error while connecting to RabbitMQ", error);
                throw error;
            }
        }
        return this.connection;
    }

    // Method to receive messages from a RabbitMQ stream
    async receive(streamName) {
        const client = await this.connect();
        console.log("Waiting for messages from stream:", streamName);

        try {
            const consumer = await client.declareConsumer({
                stream: streamName,
                messageHandler: (message) => {
                    console.log("Received message:", message.content.toString());
                },
            });
        } catch (error) {
            console.error("Error while receiving messages", error);
            throw error;
        }
    }

    // Method to send messages to a RabbitMQ stream
    async send(streamName, message) {
        const client = await this.connect();

        console.log(`Sending message to stream: ${streamName}`);
        try {
            const streamSizeRetention = 5 * 1e9;
            await client.createStream({ 
                stream: streamName, 
                arguments: { "max-length-bytes": streamSizeRetention } 
            });

            const publisher = await client.declarePublisher({ stream: streamName });
            await publisher.send(Buffer.from(message));
            console.log("Message sent:", message);
        } catch (error) {
            console.error("Error while sending message", error);
            throw error;
        }
    }

    // Method to close the connection
    async close() {
        if (this.connection) {
            console.log("Closing RabbitMQ connection...");
            await this.connection.close();
            this.connection = null;
        }
    }
}

module.exports = RabbitMQ;
