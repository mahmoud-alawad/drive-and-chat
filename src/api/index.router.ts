import { Router } from "express";
import { authRouter } from "./auth.router";
import { userRouter } from "./user.router";
import { mediaRouter } from "./media.router";

export const indexRouter = Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/auth", authRouter);
indexRouter.use("/upload", mediaRouter);

