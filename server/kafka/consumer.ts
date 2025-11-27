import {kafka} from './kafkaClient.ts';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { passwordResetTemplate } from '../templates/passwordReset.ts';

dotenv.config();
const consumer = kafka.consumer({groupId: 'email-group'});
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD 
    }
});

export async function runConsumer(){
    await consumer.connect();
    console.log("Kafka Consumer connected");
    console.log(process.env.BROKER);
    await consumer.subscribe({topic: "sendMail", fromBeginning: true});

    await consumer.run({
        eachMessage: async ({topic, partition, message})=>{
            const {email, tempCode, hash} = JSON.parse(message.value?.toString() || '{}');
            transporter.sendMail({
                from: process.env.SMTP_USERNAME,
                to: email,
                subject: "Password Reset Request",
                html: passwordResetTemplate(tempCode, hash)   
            })
        }   
    })

}


