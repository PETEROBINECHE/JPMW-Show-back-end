import express from "express"
import { addProfilePic, allUser, deleteUser, editUser, getoneuser, loginUser, userRegisertion } from "../controller/User.controller.js";

const router = express.Router();

router.post("/singeruser/:id", getoneuser);

router.post("/createuser", userRegisertion);

router.post("/log-inuser", loginUser);

router.put("/updated/:id", editUser);

router.delete("/delete/:id", deleteUser);

router.get("/", allUser);

router.put("/user/ProfilePic/:id", addProfilePic);

export default router;