import express from 'express'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
import authRoutes from './routes/authRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
app.use('/api/auth', authRoutes)
app.use('/api/payments',paymentRoutes)
app.get("/", (req,res)=>{
   return res.json({message:"Welcome to Coaches API Service"})
})

app.use((req, res) => {
  res.status(404).json({ error: "Not Found", path: req.originalUrl });
});

export default app

