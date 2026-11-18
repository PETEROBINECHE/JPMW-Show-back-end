import productmodle from "../model/product.model.js";
import uploadtocloudinary from "../middlewel/uploadtocloudinary.middlewel.js";


export const allProduct = async (req, res, next) => {
  try {
    const allProducts = await productmodle.find();
    return res.status(200).json({ massage: "All product gotten", allProducts });
  } catch (error) {
    next(error);
  }
};

export const getoneProduct = async (req, res, next) => {
  const id = req.params.id;
  try {
    const getonepro = await productmodle.findById(id);
    if (!getonepro) {
      return res.status(400).json({ message: "No product with this id" });
    }
    return res.status(200).json({ message: "product found", getonepro });
  } catch (error) {
    next(error);
  }
};

export const findbynameofproduct = async (req, res, next) => {
  const { name } = req.body;
  try {
    const productname = await productmodle.findOne({ name });
    if (!productname) {
      return res.status(400).json({ message: "No product with this name" });
    }
    return res.status(200).json({ message: "product found", productname });
  } catch (error) {
    next(error);
  }
};

export const addOneProduct = async (req, res, next) => {

  if(!req.files){
    return res.status(400).json({ message: "Product image not found!" });
  };
  const imagestoupload = req.files
// console.log(req.files);

  try {
    const uploadofimage = await Promise.all(
      req.files.map(async (file) => {
        const imageresult = await uploadtocloudinary(file.buffer);
        return imageresult.secure_url;
      })
    )
    

    const productData = {
      ...req.body,
      image: uploadofimage,
      availableSizes: JSON.parse(req.body.availableSizes),
      color: JSON.parse(req.body.color),
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      discount: Number(req.body.discount),
      bestselling: req.body.bestselling === "true",
      inStock: req.body.inStock === "true",
      dateAdded: new Date(req.body.dateAdded),
    };

    const addoneP = new productmodle(productData);
    const datap = await addoneP.save();

    return res
      .status(201)
      .json({ message: "Product added successfully!!", datap });
  } catch (error) {
    next(error);
  }
};

export const updatdproduct = async (req, res, next) => {
  const id = req.params.id;
  try {
    const updataonepro = await productmodle.findByIdAndUpdate(id, req.body);
    return res
      .status(200)
      .json({ message: "Product updata successfully", updataonepro });
  } catch (error) {
    next(error);
  }
};

export const deleteproduct = async (req, res, next) => {
  const id = req.params.id;
  try {
    const productdele = await productmodle.findByIdAndDelete(id);
    return res.status(203).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};



export const getbycategory = async (req, res, next) => {
  const category = req.params.category;
  try {
    const byCategory = await productmodle.find({category});
    if(byCategory.length >= 1){
      return res.status(200).json({ massage: `All ${category} gotten`, byCategory });
    }else{
      return res.status(200).json({ massage: `NO ${category}  category yet, pls add`});
    }
  } catch (error) {
    next(error);
  }
};



export const toCartItem = async (req, res) => {
  const id = req.params.id;
  try {
    const toCart = await productmodle.findById(id);
    if (!toCart) {
      return res.status(400).json({ message: "No product with this id" });
    }
    const cart = {name: toCart.name, image: toCart.image, availableSizes: toCart.availableSizes, Quality: toCart.Quality, description: toCart.description, price: toCart.price, gender: toCart.gender, color: toCart.color }
    return res.status(200).json({ message: "Add to cart", cart });
  } catch (error) {
    return res.send(error.message);
  }
};
