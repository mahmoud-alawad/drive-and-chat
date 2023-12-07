import { Router } from "express";
import { AuthorizedRequest, authenticate } from "./middleware";
import { upload } from "../multer";
import imageService from "../service/image.service";
import catchAsync from "../utils/catchAsync";

export const mediaRouter = Router();

mediaRouter.post(
  "/upload",
  authenticate(),
  upload.single("image"),
  catchAsync(async (req, res) => {
    const reqUser = (req as AuthorizedRequest).user;
    const { originalname, filename, path } = req.file as Express.Multer.File;

    const imageExist = await imageService.getImageByName(originalname);
    if (imageExist) {
      return res.status(403).send({
        message: `The file ${filename} already exists`,
      });
    }
    const imageCreated = await imageService.create({
      originalName: originalname,
      filename: filename,
      path: path,
      userId: reqUser.id,
    });
    console.log(imageCreated);
    
    return imageCreated; 
  })
);

mediaRouter.get(
  "/upload/all",
  authenticate(),
  catchAsync(async (req, res) => {
    const reqUser = (req as AuthorizedRequest).user;
    // const filter = pick(req.params, ["filename"]);
    // const options = pick(req.query, ["sortBy", "limit", "sortType", "skip"]);
    console.log('id image start');
    
    const imagesExist = await imageService.query({userId: reqUser.id });
    console.log("we got image with id");

    console.log(imagesExist);

    if (imagesExist) {
      return res.status(403).send({
        message: `The file ${req.params.id} already exists`,
      });
    }
    return res.send({ ciao: "" });
  })
);
