import mongoose from 'mongoose'

const connectDB = async (): Promise<void> =>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URI!,{dbName:"CRUDApplication"})
        console.log(`MongoDB connected:${con.connection.host}`);
    }catch (err: any) {
        console.error(err);
        process.exit(1);
    }
}

export default connectDB;

// import mongoose from 'mongoose';

// const connectDB = async (): Promise<void> => {
//     try {
//         if (!process.env.MONGO_URI) {
//             throw new Error('MONGO_URI environment variable is not defined');
//         }
        
//         const con = await mongoose.connect(process.env.MONGO_URI);
//         console.log(`MongoDB connected: ${con.connection.host}`);
//     } catch (err) {
//         console.error(`Error`);
//         process.exit(1); // Exit process with failure
//     }
// };

// export default connectDB;

