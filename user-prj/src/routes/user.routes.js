"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const userRoutes = (0, express_1.Router)();
userRoutes.get("/", user_controller_1.UserController.getAllUser);
userRoutes.get("/:id", user_controller_1.UserController.getUser);
userRoutes.post("/login", user_controller_1.UserController.loginTokenGen);
userRoutes.post("/register", user_controller_1.UserController.generateUser);
userRoutes.put("/:id", user_controller_1.UserController.updateUser);
exports.default = userRoutes;
