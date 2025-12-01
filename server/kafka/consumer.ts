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
    },
});

export async function runConsumer(){
    await consumer.connect();
    // console.log("Kafka Consumer connected");
    await consumer.subscribe({topic: "sendMail", fromBeginning: true});

    await consumer.run({
        eachMessage: async ({topic, partition, message})=>{
            const reciever = JSON.parse(message.value?.toString() || '{}');
            // console.log("reciever",reciever);
            if(!reciever){
                console.error("No reciever found in message");
                return;
            }
            const {email, tempCode, hash} = reciever;
            // console.log(`Sending mail to ${email} with tempCode ${tempCode}`);
            // console.log(process.env.SMTP_USERNAME);
            transporter.sendMail({
                from: process.env.SMTP_USERNAME,
                to: email,
                subject: "Password Reset Request",
                html: passwordResetTemplate(tempCode, hash) 
            })
        }   
    })

}


