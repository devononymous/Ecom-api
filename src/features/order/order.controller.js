import OrderRepository from "./order.repository.js";

  

  export default class OrderController {

    constructor(){
        this.orderRepository = new OrderRepository
    }

    async placeOrder(req,res,next){
        try{
            const userId = req.userId;
            await this.orderRepository.placeOrder(userId);
            res.status(201).send("Order is created");
        }catch(err){
            console.log(err)
            res.status(200).send("Something went wrong");
        }
    }
  }