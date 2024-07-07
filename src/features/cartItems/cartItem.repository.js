import CartItemModel from "./cartItem.model.js";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";
export default class CartItemsRepository {
  constructor() {
    this.collection = "cartItems";
  }

  async add(productID, userID, quantity) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const id = await this.getNextCounter(db);

      // find the document

      // Insertion
      await collection.updateOne(
        { productID: new ObjectId(productID), userID: new ObjectId(userID) }, 
        {
          $setOnInsert:{_id:id},  
          $inc: { quantity: quantity        
          } },
        { upsert: true }
      );
    } catch (error) {
      console.log("err=================>", error);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }

  async get(userID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      return await collection.find({ userID: new ObjectId(userID) }).toArray();
    } catch (error) {
      console.log("err=>", error);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }

  async delete(userID, carItemID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({
        _id: new ObjectId(carItemID),
        userID: new ObjectId(userID),
      });
      return result.deletedCount > 0;
    } catch (err) {
      console.log("err=>", err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }

  async getNextCounter(db) { 
    const resultDocument = await db
      .collection("counters")
      .findOneAndUpdate(
        { _id: "cartItemId" }, 
        { $inc: { value: 1 } },
        { returnDocument: "after" }
      );
      console.log("resultDocument====>", resultDocument.value);
      return resultDocument.value
  }




}
