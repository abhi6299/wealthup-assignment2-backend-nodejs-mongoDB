import express from 'express';
import './env.js';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import { connectUsingMongoose } from './src/config/mongoose.db.js';
import { codesController } from './src/codes.controller.js';

// import cookieParser from 'cookie-parser';

const server = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

server.use(cors(corsOptions));

server.use(bodyParser.json());
server.use(express.urlencoded({extended:true}));

server.use(express.static('public')); 
server.set('view engine','ejs');
server.set('views',path.join(path.resolve(),'src','views'));

const codesControl = new codesController();
server.get('/api/codes',codesControl.getCodes);
server.post('/api/codes/:id',codesControl.postCodes);
server.get('/api/codes/use',codesControl.nextPage);

server.listen(4000,()=>{
    console.log("Server started to listen on port 4000!");
    connectUsingMongoose();
})