import { ApplicationError } from "../../error-handler/applicationError.js";
import CartItemModel from "./cartItem.model.js";
import CartItemsRepository from "./cartItem.repository.js";

class CartItemsController {
  constructor() {
    this.cartItemsRepository = new CartItemsRepository();
  }
  async add(req, res) {
    try {
      const { productID, quantity } = req.body;
      const userID = req.userID;
      console.log("userID", userID);
      await this.cartItemsRepository.add(productID, userID, quantity);
      res.status(201).send("Cart is updated.");
    } catch (err) {
      console.log("err=>", err);
      return res.status(200).send("Something went wrong");
    }
  }
  async get(req, res) {
    try {
      const userID = req.userID;
      const items = await this.cartItemsRepository.get(userID);
      console.log("items", items);
      return res.status(200).send(items);
    } catch (error) {
      console.log("err=>", err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }
  async delete(req, res) { 
    const userID = req.userID;
    const carItemID = req.params.id;
    const isDeleted = await this.cartItemsRepository.delete(userID,carItemID);
    if (!isDeleted) {
      return res.status(404).send("Item not found");
    }
    return res.status(200).send("Cart item is removed");
  }
}

export default CartItemsController;
