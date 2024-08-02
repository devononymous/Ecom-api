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
productRouter.get("/", (req,res)=>{productController.getAllProducts(req,res)})

productRouter.post("/", upload.single('imageUrl'), (req,res,next)=>productController.addProduct(req,res,next)); 


productRouter.post('/rate',(req,res,next)=>{ productController.rateProduct(req,res,next)}); 

productRouter.get('/filter', (req,res)=>{productController.filterProducts(req,res)});

productRouter.get("/averagePrice", (req,res)=>{productController.averagePrice(req,res)});
productRouter.get("/:id", (req,res)=>{productController.getOneProduct(req,res)});


export default productRouter;