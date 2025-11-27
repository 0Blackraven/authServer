import {Kafka} from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();



export const kafka = new Kafka({
    clientId: 'my_app',
    brokers: ['localhost:9092'],
})