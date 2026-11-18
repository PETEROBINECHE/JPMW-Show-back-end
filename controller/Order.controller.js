import ordermodel from "../model/Order.model.js";
import crypto from "crypto";
import cartmodel from "../model/Cart.model.js";
import productmodle from "../model/product.model.js";

export const checkout = async (req, res, next) => {
  try {
    // 1. Get the logged-in customer's ID
    const userid = req.tokeninfo.id;
    console.log(userid);

    // 2. Get the customer's delivery details
    const {
      shippingName,
      phone,
      street,
      city,
      state,
      country
    } = req.body;

    // 3. Validate delivery information
    if (!shippingName || !phone || !street || !city || !state) {
      return res.status(400).json({
        message: "Please provide all required delivery details"
      });
    }

    // 4. Retrieve the customer's cart
    const userCart = await cartmodel.find({ guestId: "userid" });
    console.log(userCart);
    
    if (!userCart.length) {
      return res.status(400).json({
        message: "Your cart is empty"
      });
    }

    const orderProducts = [];
    let totalAmount = 0;

    // 5. Validate every product in the cart
    for (const item of userCart) {
      const product = await productmodle.findById(item.productid);

      if (!product) {
        return res.status(404).json({
          message: "One of the products in your cart no longer exists"
        });
      }

      if (!product.inStock || item.quantity > product.quantity) {
        return res.status(400).json({
          message: `${product.name} is unavailable in the requested quantity`
        });
      }

      // Use the price saved by your backend in the cart
      const unitPrice = item.price;
      const itemTotal = unitPrice * item.quantity;

      totalAmount += itemTotal;

      // Save a snapshot of the purchased product
      orderProducts.push({
        productid: product._id,
        name: product.name,
        quantity: item.quantity,
        price: unitPrice,
        color: item.color,
        Sizes: item.Sizes,
        image: item.image
      });
    }

    // 6. Generate a unique payment reference
    const paymentReference = crypto.randomUUID();

    // 7. Create the pending order
    const newOrder = await ordermodel.create({
      userid,
      products: orderProducts,
      totalAmount,
      paymentReference,
      paymentStatus: "pending",
      orderStatus: "pending",
      shippingAddress: {
        shippingName,
        phone,
        street,
        city,
        state,
        country: country || "Nigeria"
      }
    });

    // 8. Send the order details
    return res.status(201).json({
      message: "Order created successfully. Proceed to payment.",
      order: newOrder
    });

  } catch (error) {
    next(error);
  }
};

