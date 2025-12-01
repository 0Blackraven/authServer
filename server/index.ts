import  express from "express";
import {createServer} from "http";
import dotenv from "dotenv";
import userRouter from "./routes/userAuthRoutes.ts";
import cors from 'cors';
import { client } from "./redis/index.ts";
import {createTopic} from './kafka/admin.ts';
import { runConsumer } from "./kafka/consumer.ts";
import cookieParser from "cookie-parser";

dotenv.config();
const corConfig = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
const app = express();
app.use(cookieParser());
app.use(cors(corConfig));
app.use(express.json());
const server = createServer(app);

const port = process.env.PORT || 8080;

app.use('/users', userRouter);
    
server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});


if(await client.exists('mybloom') === 0){
    await client.bf.reserve('mybloom',0.01,1000); 
}


createTopic().catch((err) => {
    console.error("Error in Kafka admin: ");
});

runConsumer().catch((err)=>{
    console.error("Error in Kafka consumer: ");
});
