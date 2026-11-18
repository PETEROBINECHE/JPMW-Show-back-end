import usermodel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import upload from "../middlewel/multer.middlewel.js";
import {v2 as cloudinary} from "cloudinary";
import "dotenv/config";

cloudinary.config({ 
  cloud_name: process.env.my_cloud_name, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.api_secrets,
});

export const allUser = async (req, res, next) => {
  try {
    // const myError = new Error("this is my error");
    // myError.status = 404;
    // throw myError
    
    const alluser = await usermodel.find();
    return res.status(200).json({ message: "all user gotten", alluser });
  } catch (error) {
    next(error);
  }
};

export const userRegisertion = async (req, res, next) => {
  const { email, confirmPassword, password, ...others } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "passwords don't match" });
  };

  try {
    const hashpassword = await bcrypt.hash(password, 10);

    const isuser = await usermodel.findOne({ email });
    if (isuser) {
      return res
        .status(409)
        .json({ message: "User already exists. Please login" });
    };

    const adduser = new usermodel({
      ...others,
      email,
      password: hashpassword,
    });
    await adduser.save();
    return res.status(201).send({ message: "user created successfully" });
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const editinfo = await usermodel.findByIdAndUpdate(id, req.body);
    return res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deleteuser = await usermodel.findByIdAndDelete(id);
    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { password, loginInput } = req.body;
  try {
    let checkE_P;

    if (typeof loginInput === "string" && loginInput.includes("@")) {
      checkE_P = await usermodel.findOne({ email: loginInput });
    } else if (typeof loginInput === "number") {
      checkE_P = await usermodel.findOne({ phoneNumber: loginInput });
    } else {
      return res.status(400).json({ message: "Enter a valid email or phone number" });
    }

    if (!checkE_P) {
      return res.json({ message: "Email or phone number not found" });
    }

    const checkpassword = await bcrypt.compare(password, checkE_P.password);
    if (!checkpassword) {
      return res.json({ message: "password not correct" });
    }

    const payload = {id: checkE_P.id, email: checkE_P.email, phoneNumber: checkE_P.phoneNumber};
    const token = jwt.sign(payload, process.env.tokencode);
    const body = {email: checkE_P.email, firstName: checkE_P.firstName, token}
    if (checkE_P && checkpassword) {
      return res
        .status(200)
        .json({ message: `Welcome ${checkE_P.firstName}`, body });
    }
  } catch (error) {
    next(error);
  }
};

export const getoneuser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const singeruser = await usermodel.findById(id);
    return res.status(200).json({ message: "user found", singeruser });
  } catch (error) {
    next(error);
  }
};

export const addProfilePic = [ upload.single("profilePicture"), async (req, res, next) => {
  if(!req.file){
    return res.status(400).json({ message: "Profile picture is required" });
  };

  const id = req.params.id;
  try {
    const tocloud = await cloudinary.uploader.upload(req.file.path, {resource_type: "image"});
    
    const userPic = await usermodel.findByIdAndUpdate(
      id, 
      { profilePicture: tocloud.secure_url }, 
      { returnDocument: "after", runValidators: true, }
    );

    if(!userPic){
      return res.status(404).json({ message: "User not found"});
    };

    return res.status(201).json({ message: "Profile Picture added successfully", userPic });
  } catch (error) {
    next(error);
  }
}];