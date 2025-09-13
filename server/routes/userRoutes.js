import express from "express";
import { requireAuth } from "@clerk/express";
import { getPublishedCreations, getUserCreations, toggleLikeCreation } from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get('/get-user-creations', requireAuth(), auth, getUserCreations);
userRouter.get('/get-published-creations', requireAuth(), auth, getPublishedCreations);
userRouter.post('/toggle-like-creation', requireAuth(), auth, toggleLikeCreation);

export default userRouter;
