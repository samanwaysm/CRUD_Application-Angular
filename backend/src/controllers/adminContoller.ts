import { Request, Response } from "express";
import userDb from '../DB/models/userModel';
import user from '../interfaces/userInterface';
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'



function generateJwtToken(email: string, type: string, secretKey: string) {
    const payload = { email, type };
    const options = { expiresIn: '1h' };
    return jwt.sign(payload, secretKey, options);
}

const JWT_SECRET_KEY = process.env.JWTSecrectKey || 'your_default_secret_key';

const createUser = async (data: user) => {
    const userData = new userDb(data);
    await userData.save();
    return userData;
};

export default {
    login: async(req: Request, res: Response): Promise<void> => {
        try {
            const adminEmail: string = process.env.ADMIN_EMAIL!;
            const adminPassword: string = process.env.ADMIN_PASSWORD!;
            console.log(req.body);
            
            if(adminEmail !== req.body.email) {
                res.status(401).json({
                    message: 'No admin with that email',
                    err: 'email',
                    errOpt: 'notExist'
                });
                return;
            }

            if(adminPassword !== req.body.password){
                res.status(401).json({
                    message: 'Invalid crendential',
                    err: 'password',
                    errOpt: 'infoErr'
                });
                return;
            }

            const token: string = generateJwtToken (adminEmail, 'Admin', process.env.JWTSecrectKey!);

            res.status(200).json({
                message: 'Successfuly Logged in',
                token
            });
        } catch (err: any) {
            console.error(err, 'login admin');
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    getAllUsers: async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: user[] = await userDb.find({}, { password: 0 });
            
            if (userData.length === 0) {
              res.status(204).json({ message: 'No users found' });
              return;
            }
      
            res.status(200).json({userData});
          } catch (error: any) {
            console.error(error, 'getAllUsers');
            res.status(500).json({ message: 'Internal server error' });
          }
    },
    addUser: async (req: Request, res: Response): Promise<void> =>{
        try {         
            const existingUser = await userDb.findOne({ email: req.body.email });
            if (existingUser) {
                console.log('gshshshs');
                
                res.status(401).json({
                    message: 'Email already taken',
                    err: true,
                    errOpt: 'isExist'
                });
                return;
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const userData = { ...req.body, password: hashedPassword };

            const newUser = await createUser(userData);

            res.status(200).json({
                message: 'Account successfully created',
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({
                message: 'Internal server error',
                // error: error.message
            });
        }
    },
    getUserDetails: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: string = req.params.userId;
            if (!userId) return;
            
            const userData: user | null = await userDb.findOne({ _id: userId }, { password: 0 });
            
            if (!userData) {
                console.log('false');
                
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({ userData });
        } catch (error: any) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    updateUser: async (req: Request, res: Response): Promise<void> => {
        console.log('j--hiii');
        
        try {
            const userId: string = req.params.userId;
            const existingUser = await userDb.findOne({ _id: { $ne: userId }, email: req.body.email });
            const emailTaken: boolean = !!existingUser;

            if (emailTaken) {
                res.status(401).json({
                    message: 'Email already taken',
                    errOpt: 'emailTaken',
                    err: 'email'
                });
                return;
            }

            const updateData: user = {
                name: req.body.name,
                email: req.body.email
            }

            // if profileImg provided
            if (req.body.profileImg) {
                const uploadResponse = await cloudinary.uploader.upload(req.body.profileImg, {
                    resource_type: 'auto'
                });
                updateData.profileImg = uploadResponse.secure_url;
            }

            if (req.body.password) {
                const hashedPass: string = bcrypt.hashSync(req.body.password, 10);
                updateData.password = hashedPass;
            }

            await userDb.updateOne({ _id: userId }, { $set: updateData });

            res.status(200).json({
                message: 'User Updated successfully'
            });
        } catch (err: any) {
            console.error(err, 'update user');
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    deleteUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: string = req.params.userId;
            
            await userDb.deleteOne({ _id: userId });
    
            res.status(200).json({
                message: 'User Deleted Successfully'
            });
        } catch (err: any) {
            console.error(err, 'delete user');
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    verifyAdmin: async (req: Request, res: Response): Promise<void> => {
        try {
            const token: string = req.header('Authorization')!;
            const decoded = jwt.verify(token, process.env.JWTSecrectKey!) as JwtPayload;
            if(decoded.type !== 'Admin'){
                res.status(401).json({
                    message: "Invalid token",
                    invalidToken: true
                });
                return;
            }
            res.status(200).json({
                message: "Valid token",
                invalidToken: false
            });
        } catch (err:any) {
            console.error(err);
            res.status(401).json({
                message: "Invalid token",
                invalidToken: true
            });
        }
    },
}