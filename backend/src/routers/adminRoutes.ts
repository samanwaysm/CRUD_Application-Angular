import express,{ Router } from "express";
import adminController from '../controllers/adminContoller';
import verifyToken from "../middleware/authAdmin";

const route: Router = express.Router();

route.post('/login',adminController.login)
route.get('/getAllUsers',verifyToken,adminController.getAllUsers)
route.post('/addUser',verifyToken,adminController.addUser)
route.get('/getUserDetails/:userId',verifyToken,adminController.getUserDetails)
route.put('/updateUser/:userId',verifyToken,adminController.updateUser)
route.delete('/deleteUser/:userId', verifyToken, adminController.deleteUser);


route.get('/verifyToken', adminController.verifyAdmin);

export default route;