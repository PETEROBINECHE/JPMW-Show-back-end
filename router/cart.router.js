import express from "express"
import { addToCart, allUserCart, clearCart, getAllCart, getcartinform, oneUserCart, removeCartItem, updateCartItem } from "../controller/cart.controller.js";
import { tokenauth } from "../middlewel/token.middlewel.js";

const routers = express.Router();

routers.post("/cartusers-info", tokenauth, getcartinform);

routers.post("/add_Cart/:productid", addToCart);

routers.get("/all_cart/db", getAllCart);

routers.get("/user_cart/all/:id", allUserCart);

routers.get("/user_cart/one/:id", oneUserCart);

routers.patch("/updatecartitem/edit/:id", updateCartItem);

routers.delete("/deletedCart/edit/:id", removeCartItem);

routers.delete("/clearAllCart/edit", clearCart);

export default routers;