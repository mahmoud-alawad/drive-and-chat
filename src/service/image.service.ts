import { Image, Prisma } from "@prisma/client";
import { prisma } from "../db/client";

/**
 * Query for images
 * @param {Object} filter - filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const query = async <Key extends keyof Image>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    skip?: number;
    sortType?: "asc" | "desc";
  },
  keys: Key[] = [
    "id",
    "originalName",
    "filename",
    "path",
    "createdAt",
    "updatedAt",
  ] as Key[]
): Promise<Pick<Image, Key>[]> => {
  const page = options.page ?? 1;
  const skip = options.skip ?? 0;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? "desc";

  const images = await prisma.image.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: Number(skip),
    take: Number(limit),
    orderBy: sortBy ? { [sortBy]: sortType } : undefined,
  });

  return images as Pick<Image, Key>[];
};

/**
 * Create a Image instance
 * @param {Object} ImageBody
 * @returns {Promise<Image>}
 */
const create = async (
  obj: Prisma.ImageUncheckedCreateInput
): Promise<Image | null> => {
  const { originalName, filename, path, userId } = obj;
  if (await getImageByName(originalName)) {
    return null;
  }

  console.log({ originalName, filename, path, userId });

  return prisma.image.create({
    data: {
      originalName,
      filename,
      path,
      userId,
    },
  });
};

/**
 * Get Image by title
 * @param {string} title
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Image, Key> | null>}
 */
const getImageByName = async <Key extends keyof Image>(
  originalName: string,
  keys: Key[] = [
    "id",
    "originalName",
    "filename",
    "path",
    "createdAt",
    "updatedAt",
  ] as Key[]
): Promise<Pick<Image, Key> | null> => {
  return prisma.image.findUnique({
    where: { originalName: originalName },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<Image, Key> | null>;
};

/**
 * Get Image by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Image, Key> | null>}
 */
const get = async <Key extends keyof Image>(
  id: number,
  keys: Key[] = [
    "id",
    "originalName",
    "filename",
    "path",
    "createdAt",
    "updatedAt",
  ] as Key[]
): Promise<Pick<Image, Key> | null> => {
  return prisma.image.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<Image, Key> | null>;
};

/**
 * Update Image by id
 * @param {ObjectId} ImageTitle
 * @param {Object} updateBody
 * @returns {Promise<Image>}
 */
const update = async <Key extends keyof Image>(
  imageId: number,
  updateBody: Prisma.ImageUpdateInput,
  keys: Key[] = ["id", "originalName", "filename"] as Key[]
): Promise<Pick<Image, Key> | null> => {
  const image = await get(imageId, ["id", "originalName", "filename"]);
  if (!image) {
    throw new Error("image not found");
  }
  if (
    updateBody.filename &&
    (await getImageByName(updateBody.filename as string))
  ) {
    throw new Error("filename already taken");
  }
  const updatedImage = await prisma.image.update({
    where: { id: image.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  });
  return updatedImage as Pick<Image, Key> | null;
};

/**
 * Delete Image by id
 * @param {ObjectId} ImageId
 * @returns {Promise<Image>}
 */
const trash = async (imageId: number): Promise<Image> => {
  const image = await get(imageId);
  if (!image) {
    throw new Error("image not found");
  }
  await prisma.image.delete({ where: { id: image.id } });
  return image;
};

const imageService = {
  create,
  query,
  get,
  update,
  trash,
  getImageByName,
};
export default imageService;
