import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

enum Role {
  USER,
  ADMIN,
}

const users = [
  {
    username: "Bret",
    email: "Sincere@april.biz",
    password: "password",
  },
  {
    username: "Antonette",
    email: "Shanna@melissa.tv",
    password: "password",
  },
  {
    username: "Samantha",
    email: "Nathan@yesenia.net",
    password: "password",
  },
  {
    username: "Karianne",
    email: "Julianne.OConner@kory.org",
    password: "password",
  },
  {
    username: "Kamren",
    email: "Lucio_Hettinger@annie.ca",
    password: "password",
  },
  {
    username: "Leopoldo_Corkery",
    email: "Karley_Dach@jasper.info",
    password: "password",
  },
  {
    username: "Elwyn.Skiles",
    email: "Telly.Hoeger@billy.biz",
    password: "password",
  },
  {
    username: "Maxime_Nienow",
    email: "Sherwood@rosamond.me",
    password: "password",
  },
  {
    username: "Delphine",
    email: "Chaim_McDermott@dana.io",
    password: "password",
  },
  {
    username: "Moriah.Stanton",
    email: "Rey.Padberg@karina.biz",
    password: "password",
  },
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
    password: "abdalhakim",
  },
  {
    username: "free:300",
    email: "free@local.it",
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
