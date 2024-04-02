import mongoose from 'mongoose';
import { codeSchema } from './codes.schema.js';

const incorrect = [];
const correct = [];

function generateCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}
const codesModel = mongoose.model('codes',codeSchema);
export class codesController{

    async getCodes(req, res,next) {
        try {
            const generatedCode = generateCode();
            // console.log(generateCode);
            const newCode = new codesModel({value:generatedCode});
            await newCode.save();
            res.render('home',{ code: newCode.value, message:null, bool:false });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async postCodes(req, res, next){
        try {
            const codeFetched = req.params.id;
            const { code } = req.body;
            const existingCode = await codesModel.findOne({ value: code });
            console.log(code + "---" +codeFetched);
            if (!existingCode) {
                // return res.status(400).json({ message: 'Enter a valid code' });
                if(code.length!=0){
                    incorrect.push(code);
                    return res.render('home',{ code: codeFetched, message:'Enter a valid code',bool:false });
                }
                else{
                    return res.render('home',{ code: codeFetched, message:'Kindly enter some pswd',bool:false });
                }
            }
    
            if (existingCode.used) {
                // return res.status(400).json({ message: 'This code has already been used' });
                return res.render('home',{ code: existingCode.value, message:'This code has already been used. Kindly refresh!',bool:false });
            }
    
            const currentTime = new Date();
            const codeTime = new Date(existingCode.createdAt);
            const diffSeconds = Math.floor((currentTime - codeTime) / 1000);
    
            if (diffSeconds > 60) {
                // return res.status(400).json({ message: 'The code has expired' });
                correct.push(code);
                return res.render('home',{ code: existingCode.value, message:'This code is expired, Refresh the page for the new code',bool:false });
            }
    
            // Mark code as used
            existingCode.used = true;
            await existingCode.save();
    

            // Redirect user after 2 seconds
            // res.status(200).json({ message: 'Code is correct' });
            correct.push(code);
            return res.render('home',{ code: existingCode.value, message:'This code is correct, Please wait goint to the next page',bool:true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

        async nextPage(req, res,next) {
        try {
            // console.log(correct);
            // console.log(incorrect);
            res.render('details',{correct , incorrect});
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}