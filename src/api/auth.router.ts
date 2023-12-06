import { Router, Request, Response } from "express";
import { validate } from "./middleware";
import { LoginSchema, loginSchema } from "../schema/auth.schema";
import { UserCreate, userCreate } from "../schema/user.schema";
import { getJwtToken } from "../service/auth.service";
import { registerUser } from "../service/user.service";
import { prisma } from "../db/client";
import io from "../socket";
import catchAsync from "../utils/catchAsync";

export const authRouter = Router();

authRouter.post(
  "/login",
  validate(loginSchema),
  catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as LoginSchema;
    const token = await getJwtToken(payload);
    const userWithMessages = await prisma.user.findUnique({
      where: { email: payload.email },
      include: { senderMessages: true },
    });
    console.log(userWithMessages);
    if (!token) {
      return res.sendStatus(401);
    }

    return res.send({
      token,
      user: {
        name: userWithMessages?.username,
        email: userWithMessages?.email,
        id: userWithMessages?.id,
        messages: userWithMessages?.senderMessages,
      },
    });
  })
);

authRouter.post(
  "/register",
  validate(userCreate),
  catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as UserCreate;
    const user = await registerUser(payload);
    const token = await getJwtToken(payload);

    console.log(user);

    if (!user) {
      return res
        .sendStatus(404)
        .send({ message: payload.username + ": already registered" });
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    io.emit("userRegistered", { userId: user.id });
    return res.status(201).send({ token, user });
  })
);
