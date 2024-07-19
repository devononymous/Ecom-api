import mongoose from "mongoose";

export const productSchema = new mongoose.schema({
    name:String,
    price:Number,
    category:String,
    description:String,
    inStock:Number,
})