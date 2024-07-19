
import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import OrderModel from '../order/order.model.js';
import { ApplicationError } from "../../error-handler/applicationError.js";


export default class OrderRepository {
    constructor(){
      this.collection = "Orders";
    }
    async placeOrder(userId){
      const client = getClient();
      const session = client.startSession();
        try {
          const db = getDB();
          session.startTransaction();
            //1.  Get the cartItems and calculate total amount.
          const items = await this.getTotalAmount(userId, session);
          const finalTotalAmount = items.reduce((acc,item)=>acc+item.totalAmount,0)
          console.log(finalTotalAmount)  
          // 2.  Create an order Record 
         const newOrder = new OrderModel(new ObjectId(userId), finalTotalAmount, new Date())
        
         db.collection(this.collection).insertOne(newOrder, {session});

         // 3. Reduce the stock.
         for(let item of items){
          await db.collection("products").updateOne(
            {_id:item.productID},
            {$inc:{stock: -item.quantity}},
            {session}
          )
         }
        //  throw new Error("Something is wrong in placeOrder")
         // 4. Clear the cart Items.
        await db.collection("cartItems").deleteMany({ 
          userId: new ObjectId(userId)

        },{session})
        session.commitTransaction();
        session.endSession();
        return ;
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          console.log("err=>", error);
          throw new ApplicationError("Something went wrong with database", 503);
        }

    }

    async  getTotalAmount(userId,session){
    
        //  get the DB
        const db = getDB();

      const items = await db.collection("cartItems").aggregate([
          // 1. Get cart Items for the user
          {
            $match:{userID:new ObjectId(userId)}
          },
          // 2. Get the products from products collection.
          {
            $lookup:{
              from:"products",
              localField:"productID",
              foreignField:"_id",
              as:"productInfo"
            }
          } ,
          // 3.  Unwind the product info.
          {
            $unwind:"$productInfo"
          },
          // 4. Calculate total amount for each cart items.
          {
            $addFields:{
              "totalAmount":{
                   $multiply:["$productInfo.price", "$quantity"]
              }
            }
          }
        ],{session}).toArray();
      return items
        console.log("items====>",items)
    }
}