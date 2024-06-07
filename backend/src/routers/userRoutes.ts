import express,{ Router } from "express";

import userController from '../controllers/userControllers'
import verifyToken from "../middleware/authUser";

const route: Router = express.Router();


// route.get('/',userController.verifyUser)
route.post('/register',userController.register)
route.post('/login',userController.login)

route.get('/getUser',verifyToken,userController.getUser);
route.put('/updateUser', verifyToken, userController.updateUser);

route.get('/verifyToken',userController.verifyUser);

export default route;