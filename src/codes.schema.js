import mongoose from 'mongoose';

export const codeSchema = new mongoose.Schema({
    value: { type: String, unique: true },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});