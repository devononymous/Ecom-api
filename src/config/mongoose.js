import mongoose from "mongoose";

import dotenv from "dotenv";
import { categorySchema } from "../features/product/category.schema.js";
dotenv.config();
const url = process.env.DB_URL;

export const connectUserMongooese = async()=>{
  try {
    
      await  mongoose.connect(url);
     console.log("Mongodb connected using mongoose");
     addCategories();
  } catch (error) {
     console.log("Error while connecting to DB")
     console.log("errr =>",err)
  }

}

async function  addCategories(){
   const CategoryModel = mongoose.model('Category', categorySchema)
   const categories = await CategoryModel.find();
   if(!categories || categories.length == 0){
      await CategoryModel.insertMany([{name:"Books"},{name:"Clothing"} ,{name:"Electronics"}]);

   }
   console.log("Categoires are added")
}