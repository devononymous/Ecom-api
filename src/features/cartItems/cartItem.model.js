// productID, userID, quantity
export default class CartItemModel{
    constructor(productID, userID, quantity, id){
     this.productID = productID;
     this.userID = userID;
     this.quantity = quantity;
     this.id = id;
    }

   static add(productID,userID,quantity){
        const cartItem = new CartItemModel(
            productID,
            userID,
            quantity
        );
        cartItem.id =cartItems.length + 1
        cartItems.push(cartItem);
        return cartItem;
    }
    static get(userID){
        return cartItems.filter(i=> i.userID == userID);
    }
    static delete(carItemID, userID){
        const cartItemIndex = cartItems.find(i=> i.id == carItemID && i.userID == userID)
        if(cartItemIndex == -1){
            return "Item not found";
        }else{       
            cartItems.splice(cartItemIndex,1);
        }
    }
}

var cartItems =[
    new CartItemModel(1,2,1,1),
    new CartItemModel(1,1,2,2)
]