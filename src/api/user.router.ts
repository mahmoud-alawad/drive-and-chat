import { Router, Request, Response } from "express";
import { userUpdate } from "../schema/user.schema";
import { authenticate, AuthorizedRequest, validate } from "./middleware";
import { prisma } from "../db/client";
import { Image, User } from "@prisma/client";
import {
  getById,
  getUserByEmail,
  trash,
  update,
} from "../service/user.service";
import { upload } from "../multer";
import catchAsync from "../utils/catchAsync";
import imageService from "../service/image.service";
import path from "path";

export const userRouter = Router();

// example update endpoint with payload validation and authentication
userRouter.put(
  "/",
  authenticate(), // only authorized users
  validate(userUpdate), // validate request body
  async (req: Request, res: Response) => {
    const user = (req as AuthorizedRequest).user;
    const result = await update(user.id, req.body);
    return res.status(200).send(result);
  }
);

userRouter.delete(
  "/",
  authenticate(),
  catchAsync(async (req: Request, res: Response) => {
    const user = (req as AuthorizedRequest).user;
    const result = await trash(user.id);
    if (!result) {
      res.status(404).send({ message: "not founded" });
    }
    res.status(200).send(result);
  })
);

userRouter.get("/me", authenticate(), async (req: Request, res: Response) => {
  const reqUser = (req as AuthorizedRequest).user;
  const user = await getById(reqUser.id);

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

    if (result.length) {
      return res.status(200).send(
        result
          .map((singleUser: User) => {
            const { username, email, id } = singleUser;
            return {
              id,
              email,
              username,
            };
          })
          .filter((e) => e)
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
          sharedUserId: reqUser.id,
        },
      });

      return res.status(200).send({ image });
    } catch (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

userRouter.get(
  "/images/:filename",
  authenticate(),
  catchAsync(async (req, res) => {
    const reqUser = (req as AuthorizedRequest).user;
    // const filter = pick(req.params, ["filename"]);
    // const options = pick(req.query, ["sortBy", "limit", "sortType", "skip"]);
    console.log("id image start");
    const user = await getById(reqUser.id);

    const imagesExist = (await imageService.query({
      filename: req.params.filename,
    })) as Image[];
    console.log("we got image with id");

    console.log(imagesExist);

    if (!imagesExist) {
      return res.status(403).send({
        message: `The file ${req.params.id} already exists`,
      });
    }
    return imagesExist.map((image) => {
      const filepath = path.resolve(
        process.cwd() + "/uploads/" + image.filename
      );
      return res.sendFile(filepath);
    });
  })
);
