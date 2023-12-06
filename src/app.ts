import express, { Express } from "express";
import { createServer } from "http";
import { authenticate } from "./api/middleware";

const app: Express = express();
const httpServer = createServer(app);
app.use("/uploads", authenticate(), express.static("uploads"));

export { app, httpServer };
