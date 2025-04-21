import { Router } from "express";
import { signup, login, getUserInfo, updateProfile } from "../controllers/AuthControllers.js"
import { verifyToken } from "../middlewares/AuthMiddlewares.js";

const authRoutes = Router();

authRoutes.post("/signup", signup)
authRoutes.post("/login", login)
authRoutes.post("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);

export default authRoutes;
