"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const productRoutes = (0, express_1.Router)();
productRoutes.get("/", product_controller_1.ProductController.getAllProduct);
productRoutes.get("/:id", product_controller_1.ProductController.getProduct);
productRoutes.get("/category/:category", product_controller_1.ProductController.getCategory);
productRoutes.post("/", product_controller_1.ProductController.generateProduct);
productRoutes.put("/:id", product_controller_1.ProductController.editProduct);
productRoutes.delete("/:id", product_controller_1.ProductController.deleteProduct);
exports.default = productRoutes;
