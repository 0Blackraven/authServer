import {Kafka} from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

// if(!process.env.KAFKA_BROKERS){
//     throw new Error("server error");
// }

export const kafka = new Kafka({
    clientId: 'my_app',
    brokers: ['localhost:9092'] //[process.env.KAFKA_BROKERS],
})