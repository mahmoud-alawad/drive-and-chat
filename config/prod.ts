import { config as dotenv } from "dotenv";

// load env variables into process.env from .env file
dotenv();

const config = {
  server: {
    host: "",
    port: 3001,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
  },
  meta: {
    title: "Starter Template",
    version: "0.0.1",
    description: "",
  },
};

export default config;
