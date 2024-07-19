import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();
const url = process.env.DB_URL;

export const connectUserMongooese = async()=>{
  try {
    
      await  mongoose.connect(url);
     console.log("Mongodb connected using mongoose")
  } catch (error) {
     console.log("Error while connecting to DB")
     console.log("errr =>",err)
  }

}