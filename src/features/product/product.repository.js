import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";
const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(productData){
    try{
        // 1. Adding Product
        console.log("productData========>",productData)
        productData.categories = productData.category.split(',').map(e=> e.trim());
        const newProduct = new ProductModel(productData);
        const savedProduct = await newProduct.save();
        // 2. Update categories.
        await CategoryModel.updateMany(
            {_id: {$in: productData.categories}},
            {$push: {products: new ObjectId(savedProduct._id)}}
        )
    }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);    
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
        .project({ name: 1, price: 1, _id: 0 })
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  // async rate(userID, productID, rating) {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection(this.collection);

  //     // 1. Removes existing entry
  //     await collection.updateOne(
  //       { _id: new ObjectId(productID) },
  //       {
  //         $pull: { ratings: { userID: new ObjectId(userID) } },
  //       }
  //     );

  //     // 2. Add new entry
  //     await collection.updateOne(
  //       { _id: new ObjectId(productID) },
  //       {
  //         $push: { ratings: { userID: new ObjectId(userID), rating } },
  //       }
  //     );
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //     throw new ApplicationError("Something went wrong with database", 500);
  //   }
  // }
  async rate(userID, productID, rating){
    try{
        // 1. Check if product exists
        const productToUpdate = await ProductModel.findById(productID);
        if(!productToUpdate){
            throw new Error("Product not found")
        }

        // Find the existing review
        const userReview = await ReviewModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)});
        if(userReview){
            userReview.rating = rating;
            await userReview.save();
        }else{
            const newReview = new ReviewModel({
                product: new ObjectId(productID),
                user: new ObjectId(userID),
                rating: rating
            });
            newReview.save();
        }

    }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);    
    }
}

  async averageProductPricePerCategory() {
    try {
      const db = getDB();
      return await db
        .collection(this.collection)
        .aggregate([
          {
            // stage 1. Get average price per category
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (error) {
      console.log(error, "error in average price");
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default ProductRepository;
