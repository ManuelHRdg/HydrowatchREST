import express from "express";
import cors from "cors";

//Routes
import nivelesRoutes from "./routes/niveles.routes.js";

const app = express();

//Settings
app.set("port", 3500);

//Middlewares
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/hydrowatch", nivelesRoutes);

export default app;