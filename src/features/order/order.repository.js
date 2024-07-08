
import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";

export default class OrderRepository {
    constructor(){
      this.collection = "Orders";
    }
    async placeOrder(userId){
        //1.  Get the cartItems and calculate total amount.
      await this.getTotalAmount(userId);
        // 2.  Create an order Record

        // 3. Reduce the stock.

        // 4. Clear the cart Items.
    }

    async  getTotalAmount(userId){
    
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
        ]).toArray();
        const finalTotalAmount =items.reduce((acc,item)=> acc + item.totalAmount,0)
        console.log("finalTotalAmount",finalTotalAmount )
    }
}