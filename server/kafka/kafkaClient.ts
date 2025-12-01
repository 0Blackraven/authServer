import {Kafka} from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.BROKER) {
    throw new Error("BROKER not defined in environment variables");
}

export const kafka = new Kafka({
    clientId: 'my_app',
    brokers: [process.env.BROKER],
    logLevel: 2
})