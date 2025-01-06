import { Router } from "express";
import { ProductController } from "../controllers/product.controller";


const productRoutes = Router();

productRoutes.get("/",  ProductController.getAllProduct);
productRoutes.get("/:id", ProductController.getProduct);
productRoutes.get("/category/:category", ProductController.getCategory);

productRoutes.post("/", ProductController.generateProduct);

productRoutes.put("/:id", ProductController.editProduct);

productRoutes.delete("/:id", ProductController.deleteProduct);

export default productRoutes;
