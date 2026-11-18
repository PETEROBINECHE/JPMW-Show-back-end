import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema({
  productid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  image: {
    type: [String],
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    index: true
  },

  products: {
    type: [orderProductSchema],
    required: true
  },

  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  paymentReference: {
    type: String,
    required: true,
    unique: true
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "successful", "failed", "refunded"],
    default: "pending"
  },

  orderStatus: {
    type: String,
    enum: [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled"
    ],
    default: "pending"
  },

  shippingAddress: {
    shippingName: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    street: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    state: {
      type: String,
      required: true
    },

    country: {
      type: String,
      default: "Nigeria"
    }
  }

}, { timestamps: true });

const ordermodel = mongoose.model("orderinfo", orderSchema);

export default ordermodel;