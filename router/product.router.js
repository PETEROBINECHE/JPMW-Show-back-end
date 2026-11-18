import express from "express";
import { uploads } from "../middlewel/multer.middlewel.js";
import { allProduct, addOneProduct, deleteproduct, updatdproduct, getoneProduct, findbynameofproduct, getbycategory, toCartItem } from "../controller/product.controller.js";

const router = express.Router();

router.get("/allProduct", allProduct);

router.post("/Product", uploads.array("images", 6), addOneProduct);

router.delete("/Product/:id", deleteproduct);

router.put("/Product/:id", updatdproduct);

router.post("/getoneproduct/:id", getoneProduct);

router.get("/cartItem/:id", toCartItem);

router.post("/namesearch", findbynameofproduct);

router.get("/sameCategory/:category", getbycategory);

export default router;
