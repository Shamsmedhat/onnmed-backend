import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String , required: true },
  gender: {
    type: String,
    enum:["male", "female"],
    required: true
  },
  userType: {
    type: String,
    enum: ['admin', 'doctor', 'patient'],
    required: true
  },
},
{ timestamps: true },
{ versionKey: false});

export const User =  mongoose.model('User', userSchema);
