import { Router, Request, Response } from "express";
import { userUpdate } from "../schema/user.schema";
import { authenticate, AuthorizedRequest, validate } from "./middleware";
import { prisma } from "../db/client";
import { User } from "@prisma/client";
import { getById, getUserByEmail } from "../service/user.service";
import { upload } from "../multer";

export const userRouter = Router();

// example update endpoint with payload validation and authentication
userRouter.put(
  "/",
  authenticate(), // only authorized users
  validate(userUpdate), // validate request body
  async (req: Request, res: Response) => {
    const user = (req as AuthorizedRequest).user;
    const result = await prisma.user.update({
      where: { id: user.id },
      data: req.body,
    });
    return res.status(200).send(result);
  }
);

userRouter.get("/me", authenticate(), async (req: Request, res: Response) => {
  const reqUser = (req as AuthorizedRequest).user;
  const user = await getById(reqUser.id);
  console.log(user);

  if (!user) {
    return res.status(404).send({
      message: req.params.id + " is not founded",
    });
  }
  return res.status(200).send(user);
});

userRouter.get(
  "/users",
  authenticate(),
  async (req: Request, res: Response) => {
    const user = (req as AuthorizedRequest).user;
    const result = await prisma.user.findMany();
    const requestUser = await getUserByEmail(user.email);
    console.log(result);

    if (result.length) {
      return res.status(200).send(
        result.map((singleUser: User) => {
          const { username, email, id } = singleUser;
          if (singleUser.id !== requestUser?.id) {
            return {
              id,
              email,
              username,
            };
          }
          return null;
        })
      );
    }

    return res.status(404).send([]);
  }
);

userRouter.post(
  "/upload",
  authenticate(),
  upload.single("image"),
  async (req: Request, res: Response) => {
    const reqUser = (req as AuthorizedRequest).user;
    console.log(req.file);

    const { originalname, filename, path } = req.file as Express.Multer.File;

    try {
      const user = await prisma.user.findUnique({ where: { id: reqUser.id } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const image = await prisma.image.create({
        data: {
          originalName: originalname,
          filename: filename,
          path: path,
          userId: reqUser.id,
        },
      });

      return res.status(200).send({ image });
    } catch (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
