import ProductModel from "./product.model.js";
export default class ProductController {
  getAllProducts(req, res) {
    const products = ProductModel.getAll();
    res.status(200).send(products);
  }

  addProducts(req, res) {
    const { name, price, sizes } = req.body;
    const newProduct = {
      name,
      price: parseFloat(price),
      sizes: sizes,
      imageUrL: req.file.filename,
    };
    const createdRecord = ProductModel.add(newProduct);
    console.log("createdRecord==>",createdRecord)
    res.status(201).send(createdRecord);
  }

  rateProduct(req, res, next) {
    // const { userID, productID, rating } = req.querys;  // by using this error handler in server.js will show a default error message

    try {
      const { userID, productID, rating } = req.query;
      ProductModel.rateProduct(userID, productID, rating);
      return res.status(200).send("Rating has been added.");
    } catch (err) {
      next(err)
    }
  }

  getOneProduct(req, res) {
    const id = req.params.id;
    const product = ProductModel.get(id);
    if (!product) {
      res.status(404).send("Product not found");
    } else {
      return res.status(200).send(product);
    }
  }
  filterProducts(req, res) {
    console.log("Hi");
    const minPrice = req.query.minPrice;
    console.log("minPrice >>>>", minPrice);
    const maxPrice = req.query.maxPrice;
    console.log("maxPrice >>>>", maxPrice);
    const category = req.query.category;
    const result = ProductModel.filter(minPrice, maxPrice, category);
    console.log("result", result);
    res.status(200).send(result);
  }
}
