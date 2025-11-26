import {kafka} from './kafkaClient.ts';

async function init(){
    const admin = kafka.admin();
    await admin.connect();
    console.log("Kafka Admin connected");
    
    await admin.createTopics({
        topics: [
            {
                topic: "sendMail",
                numPartitions: 1, // increase if needed or u feel u getting lags
            }
        ]
    })
    console.log("Kafka Topics created");
    await admin.disconnect();
}

init().catch((err)=>{
    console.error("Error in Kafka admin: ", err);
});