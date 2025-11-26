import {kafka} from './kafkaClient.ts';

const consumer = kafka.consumer({groupId: 'email-group'});

async function runConsumer(){
    await consumer.connect();
    console.log("Kafka Consumer connected");
    await consumer.subscribe({topic: "sendMail", fromBeginning: true});

    await consumer.run({
        eachMessage: async ({topic, partition, message})=>{
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
            const messageValue = message.value?.toString();
            console.log(`- ${prefix} ${messageValue}`);
            // Here, you can add logic to actually send the email using the data from message.value
        }   
    })

}

runConsumer().catch((err)=>{
    console.error("Error in Kafka consumer: ", err);
});