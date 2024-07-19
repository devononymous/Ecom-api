import express from 'express';
import  UserController  from './user.controller.js';
import jwtAuth from "../../middlewares/jwt.middleware.js";


const userRouter = express.Router();
const userController = new UserController();

userRouter.post('/signup', (req,res,next)=>{userController.signUp(req,res,next)});
userRouter.post('/signin', (req,res)=>{userController.signIn(req,res)})
userRouter.put('/resetPassword', jwtAuth, (req,res,next)=>{userController.resetPassword(req,res,next)})


export default userRouter;

