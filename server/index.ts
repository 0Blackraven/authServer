import  express from "express";
import {createServer} from "http";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.ts";
import cors from 'cors';
import { client } from "./redis/index.ts";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const server = createServer(app);

const port = process.env.PORT || 8080;

app.use('/users', userRouter);

app.get('/users', 
    (req,res)=> res.send('Server Alive')
)


server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});


if(await client.exists('mybloom') === 0){
    await client.bf.reserve('mybloom',0.01,1000); 
}


