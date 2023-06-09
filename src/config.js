import { config } from "dotenv";

config();

export default {
    host: process.env.MYSQLHOST || "",
    port: process.env.PUERTO || "",
    database: process.env.DATABASE || "",
    user: process.env.USER || "",
    password: process.env.PASSWORD || ""

};