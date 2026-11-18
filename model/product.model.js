import mongoose from "mongoose";

const products = new mongoose.Schema(
  {
    category: {
      enum: ["sneakers", "Crocs", "Slides", "Oxfords", "Timberlands"],
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    image: {
      type: [String],
      required: true,
    },
    availableSizes: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bestselling: {
      type: Boolean,
      required: true,
    },
    Quality: {
      type: String,
      enum: ["high", "low"],
      required: true,
    },
    availablequantity: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    dateAdded: {
      type: Date,
      required: true,
    },
    gender: {
      enum: ["men", "female", "men & women"],
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      required: true,
    },
    color: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

const productmodle = mongoose.model("product", products);

export default productmodle;
