import mongoose from "mongoose";

import User from '../../interfaces/userInterface'

const UserSchema = new mongoose.Schema<User>({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        default: ''
    }
})

const Userdb = mongoose.model<User>('Userdbs', UserSchema);

export default Userdb;