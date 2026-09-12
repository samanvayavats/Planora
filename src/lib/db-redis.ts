import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
dotenv.config();

const redisUrl = process.env.REDIS_URL;

export const client = createClient({
  url: redisUrl,
});

client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});
