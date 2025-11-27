import {kafka} from './kafkaClient.ts';

export async function sendMail(event : {email: string, tempCode:string, hash:string}){
    const producer = kafka.producer();
    await producer.connect();
    console.log("Kafka Producer connected");

    await producer.send({
        topic: "sendMail",
        messages:[
            {
                value: JSON.stringify({event})
            }
        ]
    })
    console.log("Message sent");

    await producer.disconnect();
}
