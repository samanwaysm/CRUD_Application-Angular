// import { Request, Response } from "express";
// import userDb from '../DB/models/userModel'
// import user from '../interfaces/userInterface'
// import jwt, { JwtPayload, verify } from "jsonwebtoken";

// const generateJwtToken = (userId: string, email: string, type: string, secretKey: string): string => {
//     return jwt.sign(
//         { userId, email, type },
//         secretKey,
//         { expiresIn: '1h' } 
//     );
// };
// const JWT_SECRET_KEY = process.env.JWTSecrectKey

// export default {
//     login: async(req: Request,res: Response)=>{
//         console.log('ghdb');
//         res.send('hiiii')
//     },
//     register: async(req: Request, res: Response):Promise<void>=>{
//         try {
//             console.log(req.body);

//             const existingUser = await userDb.findOne({ email: req.body.email });
//             if (existingUser) {
//                 res.status(401).json({
//                     message: 'Email already taken',
//                     err: true,
//                     errOpt: 'isExist'
//                 });
//                 return;
//             }

//             const newUser = await this.createUser(req.body);

//             // Generate JWT token
//             const token = generateJwtToken(newUser._id.toString(), newUser.email, 'User', process.env.JWTSecrectKey);

//             // Send success response
//             res.status(200).json({
//                 message: 'Account successfully created',
//                 token
//             });
//         } catch (error) {
//             console.error('Error creating user:', error);
//             res.status(500).json({
//                 message: 'Internal server error',
//                 // error: error.message
//             });
//         }
//         createUser = async (data: user) => {
//             const userData = new userDb(data);
//             await userData.save();
//             return userData;
//         };
//     },

//     verifyUser: async(req: Request, res: Response)=>{
//         console.log('verifyUser');
//         res.send('hiiii')
//     }

// }

import { Request, Response } from "express";
import userDb from '../DB/models/userModel';
import user from '../interfaces/userInterface';
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import AuthUserReq from "../interfaces/authUserReqInerface";
import dotenv from "dotenv"
dotenv.config()

const generateJwtToken = (userId: string, email: string, type: string, secretKey: string): string => {
    return jwt.sign(
        { userId, email, type },
        secretKey,
        { expiresIn: '1h' }
    );
};

const JWT_SECRET_KEY = process.env.JWTSecrectKey || 'your_default_secret_key';

const createUser = async (data: user) => {
    const userData = new userDb(data);
    await userData.save();
    return userData;
};

export default {
    login: async (req: Request, res: Response) => {
        try {
            const user = await userDb.findOne({ email: req.body.email });

            if (!user) {
                return res.status(401).json({
                    message: 'No User Found With That Email',
                    err: 'email',
                    errOpt: 'notExist'
                });
            }

            const isPasswordValid = bcrypt.compareSync(req.body.password, user.password!);
            if (!isPasswordValid) {
                console.log('invalid');

                return res.status(401).json({
                    message: 'Invalid Credentials',
                    err: 'password',
                    errOpt: 'invalidPass'
                });
            }

            const token = generateJwtToken(user._id!.toString(), user.email, "User", JWT_SECRET_KEY);

            const data = {
                _id: user._id,
                name: user.name,
                email: user.email
            };

            return res.status(200).json({
                message: 'Login Successful',
                userData: data,
                token
            });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({
                message: 'Internal Server Error',
                err: 'server',
                errOpt: 'serverError'
            });
        }
    },
    register: async (req: Request, res: Response): Promise<void> => {
        try {
            const existingUser = await userDb.findOne({ email: req.body.email });
            if (existingUser) {
                res.status(401).json({
                    message: 'Email already taken',
                    err: true,
                    errOpt: 'isExist'
                });
                return;
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const userData = { ...req.body, password: hashedPassword };

            // console.log('one',req.body.profileImg);
            if (req.body.profileImg) {
                const uploadResponse = await cloudinary.uploader.upload(req.body.profileImg, {
                    resource_type: 'auto'
                });
                userData.profileImg = uploadResponse.secure_url;
            }

            const newUser = await createUser(userData);



            const token = generateJwtToken(newUser._id.toString(), newUser.email, 'User', JWT_SECRET_KEY);

            console.log('two')
            res.status(200).json({
                message: 'Account successfully created',
                token
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({
                message: 'Internal server error',
                // error: error.message
            });
        }
    },
    getUser: async (req: AuthUserReq, res: Response) => {
        console.log(req);

        const { userId } = req;
        try {
            const userData = await userDb.findOne({ _id: userId }, { password: 0 });
            console.log(userData);
            if (!userData) {
                console.log('&&&&&&&');
                
                throw new Error('User Not Found');
            }


            res.status(200).json({
                userData
            });
        } catch (err: any) {
            res.status(401).json({
                message: err.message,
                invalid: true
            });
        }
    },
    updateUser: async (req: AuthUserReq, res: Response): Promise<void> => {
        const { userId } = req;
    
        try {
            // Check if the user with the new email already exists
            const isExits = await userDb.findOne({ email: req.body.email });
    
            if (isExits && (isExits._id!.toString() !== userId)) {
                res.status(401).json({
                    message: 'Email already taken',
                    err: 'email',
                    errOpt: 'isExist'
                });
                return;
            }
    
            const newUserData: Partial<user> = {
                name: req.body.name,
                email: req.body.email
            };
    
            if (req.body.currentPass) {
                const currentUser = await userDb.findOne({ _id: userId });
    
                if (!currentUser || !bcrypt.compareSync(req.body.currentPass, currentUser.password!)) {
                    res.status(401).json({
                        message: 'Current Password Is Wrong',
                        err: 'currentPass',
                        errOpt: 'passErr'
                    });
                    return;
                }
    
                const hashedPass = bcrypt.hashSync(req.body.newPass, 10);
                newUserData.password = hashedPass;
            }
    
            if (req.body.profileImg) {
                const uploadResponse = await cloudinary.uploader.upload(req.body.profileImg, {
                    resource_type: 'auto'
                });
                newUserData.profileImg = uploadResponse.secure_url;
            }
    
            await userDb.updateOne({ _id: userId }, { $set: newUserData });
    
            res.status(200).json({
                message: 'User Updated Successfully'
            });
        } catch (err: any) {
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    },
    verifyUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                res.status(401).json({
                    message: "Authorization token missing",
                    invalidToken: true
                });
                return;
            }

            const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;

            if (decoded.type !== 'User') {
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
        } catch (err: any) {
            console.error(err);
            res.status(401).json({
                message: "Invalid token",
                invalidToken: true
            });
        }
    },
};
