import express from "express";
import { getAllUsers, searchUserByUsername, addFriend, getFriends } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", getAllUsers); 
router.get("/search", searchUserByUsername);
router.post("/add-friend", protectRoute, addFriend);
router.get("/friends", protectRoute, getFriends);

export default router;
