import mongoose from 'mongoose';

const url = process.env.DB_URL;
console.log(url);
export const connectUsingMongoose = async () =>{
    try{
        await mongoose.connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("Connected to mongoDB via mongoose ODM tool :)");
    }catch(err){
        console.log("Error while connecting to mongoose DB");
        console.log(err);
    }
}