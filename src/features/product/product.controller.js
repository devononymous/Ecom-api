import { ApplicationError } from "../../error-handler/applicationError.js";
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }
  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (error) {
      console.log("err=>", err);
      return res.status(200).send("Something went wrong");
    }
  }

  async addProducts(req, res) {
    try {
      const { name, price, sizes } = req.body;

      const newProduct = new ProductModel(
        name,
        null, 
        null, 
        req.file.filename, 
        parseFloat(price),
        sizes.split(","),
      );   
   

      const createdRecord = await this.productRepository.add(newProduct);
      console.log("createdRecord==>", createdRecord);
      res.status(201).send(createdRecord);
    } catch (err) {
      console.log("err=>", err);
      throw new ApplicationError("Something went wrong with database", 503);
    }
  }

  async rateProduct(req, res, next) {
    // const { userID, productID, rating } = req.querys;  // by using this error handler in server.js will show a default error message

    try {
      const userID = req.userID;
      console.log("userID===>", userID)
      const {productID, rating } = req.body;
      await this.productRepository.rate(userID, productID, rating);
      return res.status(200).send("Rating has been added.");
    } catch (err) {
      console.log("err in rating is ====>", err)
      console.log("Passing error to middleware")
      next(err);
    }
  }

  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (!product) {
        res.status(404).send("Product not found");
      } else {
        return res.status(200).send(product);
      }
    } catch (error) {
      console.log("err=>", error);
      return res.status(200).send("Something went wrong");
    }
  }

  async filterProducts(req, res) {
    try {
      console.log("Hi");
      const minPrice = parseInt(req.query.minPrice);
      console.log("minPrice >>>>", minPrice);
      const maxPrice = parseInt(req.query.maxPrice);
      console.log("maxPrice >>>>", maxPrice);
      const category = req.query.category;
      const result = await this.productRepository.filter(minPrice, maxPrice, category);
      console.log("result==========>", result);
      res.status(200).send(result);
    } catch (error) {
      console.log("err=>", error);
      return res.status(200).send("Something went wrong");
    }
   
  }
}
