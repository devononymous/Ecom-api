import {ObjectId} from 'mongodb';
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class ProductRepository {
  constructor(){
    this.collection = "products"
  }

  async add(newProduct) {
    try {
    //  1. Get the database
    const db = getDB();
    // 2. Get the collection
    const collection = db.collection(this.collection);
    console.log(" models newProduct=>", newProduct);
    //3. Insert the document
    await collection.insertOne(newProduct);
    return newProduct;
    }
    catch(err){
        console.log("err=>",err)
        throw new ApplicationError("Something went wrong with database",503);

    }
  }

  async getAll() {
    try{
        const db = getDB();
        const collection = db.collection(this.collection);
        return await collection.find().toArray();
    }
    catch(err){
        console.log("err=>",err)
        throw new ApplicationError("Something went wrong with database",503);
    }
  }



async get(id){
  try{
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.findOne({_id: new ObjectId(id)}); 
  }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
  }
}

async filter(minPrice, maxPrice,category){
  try {
    const db = getDB();
    const collection = db.collection(this.collection);
    let filterExpression = {};
    if(minPrice){
      filterExpression.price ={$gte: parseFloat(minPrice)}
    }
    if(maxPrice){
      filterExpression.price ={...filterExpression.price ,$lte: parseFloat(maxPrice)}
    }
    if(category){
      filterExpression.category = category
    }  // are you there ?
    return  await collection.find(filterExpression).toArray()
  } catch (error) {
    console.log("err==>",err)
    throw new Error("unable to filter the array")
  }
}


// async rate(userID, productID, rating){
//   try {
//     const db = getDB();
//     const collection = db.collection(this.collection);
//     // `. find the product
//     const product  = await collection.findOne({_id: new ObjectId(productID)})
//     // 2. check if there is a rating already for userID
//     const userRating = product?.ratings?.find(r=> r.userID == userID) 
//     if(userRating){
//       //3.  Update the rating
//       await collection.updateOne({_id: new ObjectId(productID), "ratings.userID": new ObjectId(userID)},
//     {
//      $set:{
//       "ratings.$.rating":rating
//      } 
//     })
//     }else{

//       await  collection.updateOne({_id: new ObjectId(productID)},
//      {
//        $push:{ratings:{userID: new ObjectId(userID),rating}}
//      })
//     }
//     console.log("userID", userID)

//   } catch (error) {
//     console.log(err);
//     throw new ApplicationError("Something went wrong with database", 500);
//   }

// }

// Another approach to add and replace rating in product

async rate(userID, productID, rating){
  try {
    const db = getDB();
    const collection = db.collection(this.collection);

    // 1. Removes existing entry
     await collection.updateOne({_id: new ObjectId(productID)},{
      $pull:{ratings:{userID: new ObjectId(userID)}}
     })

   // 2. Add new entry
      await  collection.updateOne({_id: new ObjectId(productID)},
     {
       $push:{ratings:{userID: new ObjectId(userID),rating}}
     })
    // }

  } catch (error) {
    console.log(err);
    throw new ApplicationError("Something went wrong with database", 500);
  }

}


}



export default ProductRepository;
