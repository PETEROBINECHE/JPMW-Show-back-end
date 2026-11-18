import express from "express";
import product from "./router/product.router.js";
import user from "./router/User.router.js";
import cartmodel from "./router/cart.router.js";
import Order from "./router/Order.router.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import guestMiddleware from "./middlewel/guest.Middleware.js"
import errorhandel from "./middlewel/errorhandle.middlewel.js";

const DBconnect = () => {
  mongoose
    .connect(process.env.DBLink)
    .then(() => console.log("DB Connected"))
    .catch((error) => console.log(error.massage));
};
const app = express();
const PORT = 3333;

// middlewel
app.use(express.json());
//cookies-Parser
app.use(cookieParser());
app.use(express.text({type: "text/plain"}));
app.use(cors({origin: "http//localhost:3000", credentials: true}));
app.use(guestMiddleware);

app.get("/test", (req, res) => {

  console.log("Guest ID:", req.guestId);
console.log("it is here 5");
  res.json({
    message: "Guest identified",
    guestId: req.guestId
  });
console.log("it is here 6");
});

app.use(Order);
app.use(product);
app.use(cartmodel);
app.use(user);

app.use(errorhandel);

app.listen(PORT, () => {
  DBconnect();
  console.log(`JPMW server is up and running with port ${PORT}`);
});
