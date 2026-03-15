import { config } from "dotenv";

config();

export const PORT = process.env.PORT || "3000";
export const CLIENTS = process.env.CLIENTS || "";
export const HASHING_SALT = process.env.HASHING_SALT || "";
