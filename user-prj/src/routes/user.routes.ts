import { Router } from "express";
import { UserController } from "../controllers/user.controller";


const userRoutes = Router();

userRoutes.get("/",  UserController.getAllUser);
userRoutes.get("/:id",  UserController.getUser);

userRoutes.post("/login",  UserController.loginTokenGen);
userRoutes.post("/register",  UserController.generateUser);

userRoutes.put("/:id",  UserController.updateUser)

export default userRoutes;
