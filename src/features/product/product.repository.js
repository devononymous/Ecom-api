import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class ProductRepository {
  constructor() {
    this.collection = "products";
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
    } catch (err) {
      console.log("err=>", err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }

  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.find().toArray();
    } catch (err) {
      console.log("err=>", err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }

  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // async filter(minPrice,categories){
  //   try {
  //     const db = getDB();
  //     const collection = db.collection(this.collection);
  //     let filterExpression = {};
  //     if(minPrice){
  //       filterExpression.price ={$gte: parseFloat(minPrice)}
  //     }
  //     // if(maxPrice){
  //     //   filterExpression.price ={...filterExpression.price ,$lte: parseFloat(maxPrice)}
  //     // }
  //     if(categories){
  //       categories = JSON.parse(categories.replace(/'/g,'"'));
  //       console.log("categories=========>", categories)
  //       filterExpression ={$or :[ { category:{$in:categories} }, filterExpression ] };
  //     }
  //     return  await collection.find(filterExpression).toArray()
  //   } catch (error) {
  //     console.log("err==>",error)
  //     throw new Error("unable to filter the array")
  //   }
  // }

  // async filter(minPrice, categories) {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection(this.collection);
  //     let filterExpression = {};
  //     if (minPrice) {
  //       filterExpression.price = { $gte: parseFloat(minPrice) };

  //     }
  //     // ['Cat1', 'Cat2']
  //     console.log(categories, "before conversion");
  //     console.log(categories, "after conversion");
  //     categories = JSON.parse(categories.replace(/'/g, '"'));
  //     if (categories) {
  //       filterExpression = {
  //         $or: [{ category: { $in: categories } }, filterExpression],
  //       };
  //       // filterExpression.category=category
  //     }
  //     return collection
  //       .find(filterExpression)
  //       .project({ name: 1, price: 1, _id: 0, ratings: { $slice: -1 } })
  //       .toArray();
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError("Something went wrong with database", 500);
  //   }
  // }


  // update with  chatgpt 
  async filter(minPrice, categories) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
  
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
  
      console.log(categories, "before conversion");
      try {
        categories = categories.replace(/'/g, '"');
      } catch (err) {
        throw new ApplicationError("Invalid categories format", 400);
      }
      console.log(categories, "after conversion");
  
      if (categories && Array.isArray(categories)) {
        filterExpression = {
          $or: [{ category: { $in: categories } }, filterExpression],
        };
      }
  
      return collection
        .find(filterExpression)
        .project({ name: 1, price: 1 , _id:0})
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  


  // updated wtih chatgpt

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

  async rate(userID, productID, rating) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      // 1. Removes existing entry
      await collection.updateOne(
        { _id: new ObjectId(productID) },
        {
          $pull: { ratings: { userID: new ObjectId(userID) } },
        }
      );

      // 2. Add new entry
      await collection.updateOne(
        { _id: new ObjectId(productID) },
        {
          $push: { ratings: { userID: new ObjectId(userID), rating } },
        }
      );
      // }
    } catch (error) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async averageProductPricePerCategory(){
    try {
      const db = getDB();
    return  await db.collection(this.collection)
      .aggregate([{
        // stage 1. Get average price per category
        $group:{
          _id:"$category",
          averagePrice:{$avg:"$price"}
        }
      }]).toArray();
    } catch (error) {
      console.log(error , "error in average price");
      throw new ApplicationError("Something went wrong with database", 500);

    }
  }
}

export default ProductRepository;
