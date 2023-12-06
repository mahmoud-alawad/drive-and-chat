import { prisma } from "../db/client";
import bcrypt from "bcrypt";
import { UserCreate, UserReturn } from "../schema/user.schema";
import type { User } from "@prisma/client";

export async function registerUser(
  payload: UserCreate
): Promise<UserReturn | null> {
  // fetch by username or by email
  const user = await prisma.user.findMany({
    where: { OR: [{ username: payload.username }, { email: payload.email }] },
  });
  console.log(user);

  // check that user does not exist yet
  if (user.length) {
    return null;
  }
  // hash user password
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  // save to db and return newly registered user
  return await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });
}

/**
 * Get user by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
export const getUserByEmail = async <Key extends keyof User>(
  email: string,
  keys: Key[] = [
    "id",
    "email",
    "username",
    "password",
    "createdAt",
    "updatedAt",
    "senderMessages",
    "images",
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
export const getById = async <Key extends keyof User>(
  id: string
): Promise<Pick<User, Key> | null> => {
  const result = await prisma.user.findUnique({
    where: { id },
    include: {
      reciverMessages: true,
      senderMessages: true,
      images: true,
    },
  });

  return result as Pick<User, Key> | null;
};
