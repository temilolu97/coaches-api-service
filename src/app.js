import express from 'express'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
import authRoutes from './routes/authRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
app.use('/api/auth', authRoutes)
app.use('/api/payments',paymentRoutes)
export default app

