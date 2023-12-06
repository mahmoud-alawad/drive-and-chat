import { Router } from "express";
import { AuthorizedRequest, authenticate } from "./middleware";
import { upload } from "../multer";
import { uploadUserMedia } from "../service/upload.service";
import imageService from "../service/image.service";

export const mediaRouter = Router();
mediaRouter.post(
  "/upload",
  authenticate(),
  upload.single("image"),
  async (req, res) => {
    const reqUser = (req as AuthorizedRequest).user;
    const { originalname, filename, path } = req.file as Express.Multer.File;
    const imageExist = await imageService.getImageByName(originalname);
    if (imageExist) {
      return res.status(400).send({
        message: `The file ${filename} already exists`,
      });
    }
    return await imageService.create({
      originalName: originalname,
      filename: filename,
      path: path,
      userId: reqUser.id,
    });
  }
);
