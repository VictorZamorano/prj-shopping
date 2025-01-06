import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

// ROUTES
import productRoutes from "./src/routes/product.routes";

export const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/", productRoutes);

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
    console.log("SERVER ON", "http://localhost:" + PORT);
})

