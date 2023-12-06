import type { Request, Response } from "express";
import { AuthorizedRequest } from "../api/middleware";
import { prisma } from "../db/client";

export const uploadUserMedia = async (req: Request, res: Response) => {
  const reqUser = (req as AuthorizedRequest).user;
  const { originalname, filename, path } = req.file as Express.Multer.File;

  try {
    const user = await prisma.user.findUnique({ where: { id: reqUser.id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const imageExist = await prisma.image.findUnique({
      where: { originalName: originalname },
    });

    if (imageExist) {
      return res.status(400).send("exist");
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
};
