import CartItemModel from "./cartItem.model.js";

 class CartItemsController {
    add(req,res){
        const { productID ,quantity } = req.query;
        const userID = req.userID;
        console.log("userID",userID)
        // if(!userID){
        //     res.status(401).send("User id not found");
        // }
        CartItemModel.add(productID,userID,quantity);
        res.status(201).send("Cart is updated.")

    }
    get(req,res){
        const userID = req.userID;
        const items = CartItemModel.get(userID);
        console.log("items",items)
        return res.status(200).send(items)
    }
    delete(req,res){
        const userID = req.userID;
        const carItemID = req.params.id;
        const error = CartItemModel.delete(carItemID,userID)
        if(error){
            return res.status(404).send(error);
        }
        return res.status(200).send("Cart item is removed")

    }
}

export default CartItemsController