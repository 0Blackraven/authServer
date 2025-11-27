import { kafka } from './kafkaClient.ts';

export async function createTopic() {
    const admin = kafka.admin();
    await admin.connect();
    console.log("Kafka Admin connected");

    const topics = await admin.listTopics();

    if (!topics.includes("sendMail")) {
        await admin.createTopics({
            topics: [
                {
                    topic: "sendMail",
                    numPartitions: 1, // increase if needed or u feel u getting lags
                }
            ]
        })
    }
    console.log("Kafka Topics created");
    await admin.disconnect();
}

