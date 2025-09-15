

import express from "express"
import { getPublishedCreations, getUserCreations, toggleLikeCreation } from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";

const userRouters = express.Router();

userRouters.get('/get-user-creations', auth, getUserCreations)
userRouters.get('/get-published-creations', auth, getPublishedCreations)
userRouters.post('/toggle-like-creation', auth, toggleLikeCreation)

export default userRouters;

