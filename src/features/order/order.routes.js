import express from 'express';
import OrderController from './order.controller.js';
// 2. Intialize Express router
const orderRouter = express.Router();
const orderController = new OrderController();

orderRouter.post("/",(req,res,next)=>{ orderController.placeOrder(req,res,next)});
orderRouter.get("/", (req,res)=>{orderController.get(req,res)});
// orderRouter.delete("/:id",(req,res)=>{ orderController.delete(req,res)});




export default orderRouter;