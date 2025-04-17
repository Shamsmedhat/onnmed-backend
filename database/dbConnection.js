import mongoose from "mongoose";

export const dbConnection = mongoose.connect('mongodb+srv://shamsmedhat1:QjW6D8Drucnyva8k@cluster0.cfoczsm.mongodb.net/onnmed-db')
.then(()=> console.log('database connected successfully' ))
// mongodb+srv://shamsmedhat1:QjW6D8Drucnyva8k@cluster0.cfoczsm.mongodb.net/onnmed-db
// mongodb://localhost:27017/onnmed-db
// QjW6D8Drucnyva8k
