import express from "express"
import { checkout } from "../controller/Order.controller.js";

const routers = express.Router();

routers.post("/checkout/order/:id", checkout);

export default routers;