import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    firstName: {
      required: true,
      type: String,
      trim: true,
    },
    lastName: {
      required: true,
      type: String,
      trim: true,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      "lowercase": true,
      trim: true,
    },
    phoneNumber: {
      required: true,
      type: Number,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    confirmPassword: {
      type: String,
    },
  },
  { timestamps: true },
);

const usermodel = mongoose.model("users", userschema);

export default usermodel;

    // isMember: {
    //   required: true,
    //   type: Boolean,
    // },