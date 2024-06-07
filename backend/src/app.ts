import express, {Application, Request, Response } from 'express'
import userRoute from './routers/userRoutes'
import adminRoutes from './routers/adminRoutes'
import { config } from 'dotenv';
import cors from 'cors';
import connectDB from './DB/connection/connection';
import { v2 as cloudinary } from 'cloudinary'

config();
connectDB();
const PORT=3001
const app: Application = express();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

app.use(cors({
    origin: "http://localhost:4200"
}));
app.use(express.json({limit:"30mb"}));
app.use(express.urlencoded({ extended: true }));

app.use('/api',userRoute);
app.use('/admin/api', adminRoutes);

app.get('/',(req,res)=>{
    console.log('hiiiii')
    res.send('hiiii')
})
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})