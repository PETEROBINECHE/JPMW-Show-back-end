import cartmodel from "../model/Cart.model.js";
import jwt from "jsonwebtoken";
import productmodle from "../model/product.model.js";
import { json } from "express";
import mongoose from "mongoose";

export const getcartinform = async (req, res, next) => {
  const tokenid = req.tokeninfo.id;
  const body = req.body;
  const productid = req.body.productid;

  const confrimProduct = await productmodle.findById(productid);
  if (!confrimProduct) {
    const myError = new Error("product not found");
    myError.status = 404;
    throw myError;
  }

  let existingCartItem = await cartmodel.findOne({
    userid: tokenid,
    productid: body.productid,
    color: body.color,
    Sizes: body.Sizes,
  });

  if (existingCartItem) {
    existingCartItem.quantity += body.quantity;

    existingCartItem.totalPrice =
      existingCartItem.quantity * existingCartItem.price;

    await existingCartItem.save();

    const getUserCartItems = await cartmodel.find({ userid: tokenid });

    return res.status(200).json({ message: "updateded, all cart item gotten", getUserCartItems });
  }

  try {
    const addUserCart = new cartmodel({
      ...body,
      userid: req.tokeninfo.id,
      totalPrice: body.quantity * body.price,
    });
    await addUserCart.save();
    const allCartItems = await cartmodel.find({ userid: tokenid });
    return res
      .status(200)
      .json({ message: "Product added to cart ", allCartItems });
  } catch (error) {
    next(error);
  }
};

// addToCart()
export const addToCart = async (req, res, next) => {
  console.log(req.guestId);
  
  const { Sizes, color, quantity } = req.body;

  const productid = req.params.productid;

  const checkproduct = await productmodle.findById(productid);
  if (!checkproduct) {
    const myError = new Error("product not found");
    myError.status = 404;
    throw myError;
  };

  const vrifySentandDBColor = () => {
    for(const col of checkproduct.color){
      if(color === col){
        return color;
      };
    }
    return res.status(400).json({message: "pick avalable color"});
  };

  const vrifySentandDBSize = () => {
    for(const size of checkproduct.availableSizes){
      if(Sizes === size){
        return Sizes;
      };
    }
    return res.status(400).json({message: "pick avalable sized"});
  };

  console.log("it is here 7");
  const getguestId = req.guestId;
  console.log("Guest ID:", getguestId);

  try {
    const existingCartItem = await cartmodel.findOne({
      guestId: getguestId,
      productid: productid,
      Sizes: Sizes,
      color: color,
    });

    if (existingCartItem){
      existingCartItem.quantity += Number(quantity);

      existingCartItem.totalPrice = 
      existingCartItem.price * existingCartItem.quantity;

      await existingCartItem.save();
      return res.status(200).json({message: "Cart quantity updated", cart: existingCartItem});
    };

    const newCartItem = await cartmodel.create({
      guestId: getguestId,
      productid: productid,
      name: checkproduct.name,
      category: checkproduct.category,
      brand: checkproduct.brand,
      description: checkproduct.description,
      quantity: quantity,
      gender: checkproduct.gender,
      color: vrifySentandDBColor(),
      Sizes: vrifySentandDBSize(),
      price: checkproduct.price,
      image: checkproduct.image,
      totalPrice: checkproduct.price * quantity,
      Quality: checkproduct.Quality,
      availablequantity: checkproduct.availablequantity
    });

    return res
    .status(200)
    .json({message: "Product added to cart", cart: newCartItem})
  } catch (error) {
    next(error);
  }
};

// getCart()
export const getAllCart = async (req, res, next) => {
  try{
    const forAllCart = await cartmodel.find();
    return res.status(200).json({message: "All cart for all user gotton", forAllCart})
  } catch (error) {
    next(error);
  }
};

// get all cart() from a single user.
export const allUserCart = async (req, res, next) => {
    const id = req.params.id;
  try{
    const getUserCartItems = await cartmodel.find({ guestId: id });
    return res.status(200).json({ message: "All user cart items retrieved successfully", getUserCartItems });
  } catch (error) {
    next(error);
  }
};

// get one user cart() from a single user.
export const oneUserCart = async (req, res, next) => {
    const id = req.params.id;
  try{
    const oneUserCartItem = await cartmodel.findOne({
      _id: id,
      guestId: req.guestId
    });
    return res.status(200).json({ message: "user cart item gotten", oneUserCartItem });
  } catch (error) {
    next(error);
  }
};


// updateCartItem()
export const updateCartItem = async (req, res, next) => {
  try {
    // 1. Get the cart ID from the URL.
    const { id } = req.params;

    // 2. Find the cart item belonging to this guest.
    const cartItem = await cartmodel.findOne({
      _id: id,
      guestId: req.guestId
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found"
      });
    };

    // 3. Find the actual product.
    const checkproduct = await productmodle.findById(
      cartItem.productid
    );

    if (!checkproduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // 4. Get the new values.
    // If a field wasn't sent, keep its existing value.
    const color = req.body.color ?? cartItem.color;

    const Sizes = req.body.Sizes !== undefined
      ? Number(req.body.Sizes)
      : cartItem.Sizes;

    const quantity = req.body.quantity !== undefined
      ? Number(req.body.quantity)
      : cartItem.quantity;

    // 5. Validate color.
    if (!checkproduct.color.includes(color)) {
      return res.status(400).json({
        message: "Pick an available color",
        availableColors: checkproduct.color
      });
    }

    // 6. Validate size.
    const availableSizes = checkproduct.availableSizes.map(Number);

    if (!availableSizes.includes(Sizes)) {
      return res.status(400).json({
        message: "Pick an available size",
        availableSizes: checkproduct.availableSizes
      });
    }

    // 7. Validate quantity.
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a valid number greater than zero"
      });
    }

    if (quantity > checkproduct.quantity) {
      return res.status(400).json({
        message: "Requested quantity exceeds available stock",
        availableQuantity: checkproduct.quantity
      });
    }

    // 8. Calculate the new total price.
    const price = checkproduct.price;
    const totalPrice = price * quantity;

    // 9. Save the changes.
    const updatedCart = await cartmodel.findOneAndUpdate(
      {
        _id: id,
        guestId: req.guestId
      },
      {
        $set: {
          color,
          Sizes,
          quantity,
          price,
          totalPrice
        }
      },
      {
        returnDocument: 'after',
        runValidators: true
      }
    );

    return res.status(200).json({
      message: "Cart item updated successfully",
      updatedCart
    });

  } catch (error) {
    next(error);
  }
};


// removeCartItem()
export const removeCartItem = async (req, res, next) => {
  try {
    // 1. Get the cart ID from the URL.
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
      message: "Invalid cart ID"
      });
    }

    const deletedCart  = await cartmodel.findOneAndDelete({
      _id: id,
      guestId: req.guestId
    });


    if (!deletedCart) {
      return res.status(404).json({
        message: "Cart item not found"
      });
    };

    return res.status(200).json({message: "Cart item deleted successfully"});
  } catch (error) {
    next(error);
  }
};

// clearCart()
export const clearCart = async (req, res, next) => {
    try {
    const deletedAllCart  = await cartmodel.deleteMany({
      guestId: req.guestId
    });

    if (deletedAllCart.deletedCount === 0) {
      return res.status(404).json({
        message: "Your cart is already empty"
      });
    };

    return res.status(200).json({
      message: "Cart cleared successfully",
      deletedCount: deletedAllCart.deletedCount
    });
    } catch (error) {
      next(error);
    }
};

// checkout()
