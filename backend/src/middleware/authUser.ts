import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AuthUserReq from '../interfaces/authUserReqInerface';
import dotenv from "dotenv"
dotenv.config()

function verifyToken(req: AuthUserReq, res: Response, next: NextFunction) {
    const token: string | undefined = req.header('Authorization');
    console.log(token);
    

    if(!token)return res.status(401).json({isAuth: false, error: 'Access denied'});

    try {
        const decoded = jwt.verify(token, process.env.JWTSecrectKey!) as JwtPayload;
        req.userId = decoded.userId;

        if(decoded.type !== "User"){
            res.status(401).json({ invalidToken: false, error: 'Invalid token' });
            return;
        }
        
        next();
    } catch (err: any) {
        console.error('Error:', err);
        res.status(401).json({ invalidToken: false, error: 'Invalid token' });
    }
}

export default verifyToken;