import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const users = [
  {
    username: "useruser",
    email: "user@gmail.com",
    password: "password",
  },
  {
    username: "testtest",
    email: "test@gmail.com",
    password: "password",
  },
  {
    username: "mahmoud alawad",
    email: "awad25.ma@gmail.com",
    password: "password",
  },
  {
    username: "fatima",
    email: "fatima@gmail.com",
    password: "password",
  },
];
const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < users.length; i++) {
    const userToSeed = users[i];
    const hashedPassword = await bcrypt.hash(userToSeed.password, 10);
    // save to db and return newly registered user
    await prisma.user.create({
      data: { ...userToSeed, password: hashedPassword },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
