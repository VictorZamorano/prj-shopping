import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

// ROUTES
import userRoutes from "./routes/user.routes";


export const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/", userRoutes);

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
    console.log("SERVER ON", "http://localhost:" + PORT);
})
