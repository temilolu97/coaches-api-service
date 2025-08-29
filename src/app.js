import express from 'express'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
import authRoutes from './routes/authRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
app.use('/api/auth', authRoutes)
app.use('/api/payments',paymentRoutes)
app.get("/", (req,res)=>{
    res.json({message:"Welcome to Coaches API Service"})
})
export default app

