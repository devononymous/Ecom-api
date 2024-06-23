import { ApplicationError } from "../../error-handler/applicationError.js";
import { UserModel } from "../user/user.model.js";

export default class ProductModel {
  constructor(id, name, desc, category, imageUrl, price, sizes) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.category = category;
    this.imageUrl = imageUrl;
    this.price = price;
    this.sizes = sizes;
  }
  static add(product) {
    product.id = products.length + 1;
    products.push(product);
    return product;
  }
  static getAll() {
    return products;
  }
  static get(id) {
    const product = products.find((i) => i.id == id);
    return product;
  }
  static filter(minPrice, maxPrice, category) {
  
    let result1 = [];
    const result = products.map((product) => {
      console.log(product.category, category, "after initializing the result variable should display category")
      if (product.price >= minPrice && product.price <= maxPrice && product.category == category ) {
        result1.push(product);
        console.log(product, "product display here <=== result unused variable");
      }
    });
    return result1;
  }

  static rateProduct(userID, productID, rating){
   // 1. Validate user and product
  const user =  UserModel.getAll().find(u => u.id == userID);
   if(!user){
    throw new ApplicationError("User not found",400);
   }

   //validate product : If product exists or not 
   const product = products.find((p)=> p.id == productID);
   if(!product){
    throw new ApplicationError("product not found",400)
   }

   // check if there are any ratings if not add ratings array.
   if(!product.ratings){
    product.ratings = [];
    product.ratings.push({
       userID: userID ,
        rating: rating 
      });

   } else {
    // check if user rating is already available
    const existingRatingIndex = product.ratings.findIndex((r) =>
       r.userID == userID)
  
   
   if(existingRatingIndex >= 0){
    product.ratings[existingRatingIndex] ={
      userID:userID,
      rating:rating
    }
   } else {
    // if not existing rating, then add new rating.
    product.ratings.push({
      userID: userID ,
       rating: rating 
     });
   }

  }}
}

var products = [
  new ProductModel(
    0,
    "apple",
    "apple products apple manufactured",
    "Category1",
    "https://w7.pngwing.com/pngs/48/384/png-transparent-apple-logo-business-desktop-apple-heart-computer-logo.png",
    19.99,
    ["S", "M", "L", "XXL"]
  ),
  new ProductModel(
    1,
    "samsung",
    "samsung products samsung manufactured",
    "Category1",
    "https://w7.pngwing.com/pngs/176/171/png-transparent-samsung-galaxy-gurugram-faridabad-logo-samsung-blue-text-logo.png",
    10.99,
    ["S", "M", "XL", "XXL"]
  ),
  new ProductModel(
    2,
    "oneplus",
    "oneplus products oneplus manufactured",
    "Category1",
    "https://pixlok.com/wp-content/uploads/2021/04/OnePlus_logo-PNG-768x768.jpg",
    29.99,
    ["M", "L", "XL", "XXL"]
  ),
  new ProductModel(
    3,
    "Google",
    "Google products Google manufactured",
    "Category3",
    "https://w7.pngwing.com/pngs/989/129/png-transparent-google-logo-google-search-meng-meng-company-text-logo-thumbnail.png",
    39.99,
    ["S", "M", "L", "XL"]
  ),
];
