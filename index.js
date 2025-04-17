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

app.use(cors())
app.use(express.json())
app.use('/api/auth' , authRouter)
app.use('/api/users' , userRouter)
app.use('/api/appointments' , appointmentRouter)


app.get('/api', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
