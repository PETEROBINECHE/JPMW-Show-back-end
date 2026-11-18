import mongoose from "mongoose";

const cartschema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: false,
  },
  guestId: {
    type: String,
    required: false
  },
  productid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productid",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  Quality: {
    type: String,
  },
  description: {
    type: String,
  },
  brand: {
    type: String,
  },
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  availablequantity: {
    type: Number,
    // required: true,
  },
  color: {
    type: String,
    required: true,
  },
  Sizes: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
  },
  image: {
    type: [String],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
});

const cartmodel = mongoose.model("cart", cartschema);

export default cartmodel;
