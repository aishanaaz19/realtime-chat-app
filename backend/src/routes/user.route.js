import express from "express";
import { getAllUsers, searchUserByUsername, addFriend, getFriends, blockUser, blocked, unblockUser, blockStatus } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", getAllUsers); 
router.get("/search", searchUserByUsername);
router.post("/add-friend", protectRoute, addFriend);
router.get("/friends", protectRoute, getFriends);
router.post("/block", protectRoute, blockUser); 
router.get("/blocked", protectRoute, blocked);
router.post("/unblock", protectRoute, unblockUser); 
router.get("/users/:id/block-status", protectRoute, blockStatus);

export default router;
