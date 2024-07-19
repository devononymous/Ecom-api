import mongoose from "mongoose";

export const cartItemSchema = new mongoose.schema({
    productID:{type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    userID:{type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    quantity:Number,
  
})