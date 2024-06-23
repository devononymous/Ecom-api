// Manage routes/paths to  Product Controller

// 1. imprt express
import express from 'express';
import ProductController from './product.controller.js';
import { upload } from '../../middlewares/fileUpload.middlware.js'

// 2. Intialize Express router
const productRouter = express.Router();
const productController = new ProductController();

// All the paths to controller methods.
// localhost:/api/products
productRouter.get("/", productController.getAllProducts);
productRouter.post("/", upload.single('imageUrl'), productController.addProducts); 


productRouter.post('/rate', productController.rateProduct); 

// localhost:3200/api/products/filter?minPrice=10&maxPrice=20&category=Category1
productRouter.get('/filter', productController.filterProducts);

productRouter.get("/:id", productController.getOneProduct);
export default productRouter;