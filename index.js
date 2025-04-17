import express from 'express'
import { dbConnection } from './database/dbConnection.js'
import userRouter from './src/modules/user/user.routes.js'
import appointmentRouter from './src/modules/appointment/appointment.routes.js'
import authRouter from './src/modules/auth/auth.routes.js'
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

const corsOptions = {
    origin: ["http://localhost:3000", "https://onnmed.vercel.app"],
    allowedHeaders: ["Accept-Language", "Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Enable cors headers for options requests (requests the browser make as a pre-flight before delete&patch requests)
// Without this any patch/delete would probably not work on any endpoint
app.options("*", cors(corsOptions));

app.use(express.json())
app.use('/api/auth' , authRouter)
app.use('/api/users' , userRouter)
app.use('/api/appointments' , appointmentRouter)


app.get('/api', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
