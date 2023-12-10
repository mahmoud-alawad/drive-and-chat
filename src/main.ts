/* eslint-disable @typescript-eslint/ban-ts-comment */
import { json, Request, Response } from "express";
import { indexRouter } from "./api/index.router";
import config from "config";
import cors from "cors";
import { prisma } from "./db/client";
import { app, httpServer } from "./app";
import io from "./socket";
import { mediaRouter } from "./api/media.router";
import path from "path";
import fs from "fs";
import { verifyToken } from "./api/middleware";

app.use(cors({ origin: "*" }));

app.use(json({ strict: false }));
app.use(mediaRouter);
app.use((req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    url: req.url,
    headers: req.headers,
    browserCookies: req.query.browserCookies,
  };
  const logsDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }
  const logFilePath = path.join(process.cwd(), "logs", "requests.log");

  const logEntry = JSON.stringify(logData, null, 2) + "\n";

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });

  next();
});
app.use("/api", indexRouter);

// root route serving as health check
app.get("/", (_: Request, res: Response) => {
  return res.status(200).send(`${config.get("meta.title")} is running...`);
});

app.use((req, res, next) => {
  next(res.send("404"));
});

const port = config.get("server.port");
const socketUserMap = new Map();
const socketUsers: { [key: string]: string } = {};

io.use(async (socket, next) => {
  const authHeader = socket.handshake.headers.authorization as string;
  const err = new Error("Authentication error");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(err);
  }

  try {
    const verifiedPayload = await verifyToken(authHeader);
    const user = await prisma.user.findUnique({
      where: { id: verifiedPayload?.id },
    });
    socket.data.user = user;
    if (user) {
      socket.join(user.id);
    }
  } catch (error) {
    next(error);
  }
  next();
});

io.on("error", (err) => {
  console.log("socket error");
  console.log(err);
});

io.on("connection", async (socket) => {
  socket.on("login", async (payload) => {
    socketUsers[payload.userId] = socket.id;
    console.log(`User ${payload.userId} connected`);
    const userMessages = await prisma.message.findMany({
      where: { senderId: payload.userId, receiverId: payload.receiverId },
      orderBy: {
        createdAt: "asc", // or 'desc' for descending order
      },
      include: {
        sender: true,
      },
    });
    const reciverMessages = await prisma.message.findMany({
      where: { senderId: payload.receiverId, receiverId: payload.senderId },
      orderBy: {
        createdAt: "asc", // or 'desc' for descending order
      },
      include: {
        sender: true,
      },
    });
    socket.emit("updateOnlineUsers", Object.keys(socketUsers));
    socket.emit("chatHistory", [...userMessages, ...reciverMessages]);
  });

  socket.on("message", async (data) => {
    const { senderId, receiverId, text } = data;
    const message = await prisma.message.create({
      data: {
        text,
        senderId,
        receiverId,
      },
      include: {
        sender: true,
        reciver: true,
      },
    });

    // io.to(socket.id).emit("chat message", message);
    // if (io.sockets.sockets[receiverId]) {
    //   io.to(io.sockets.sockets[receiverId].id).emit("chat message", message);
    // }
    console.log("sender id", senderId);
    console.log("reciver id", receiverId);

    // io.to(socketUsers[senderId]).emit("newMessage", message);
    io.to(socketUsers[receiverId]).emit("newMessage", message);
    io.emit("message", data);
  });
  // when the client emits 'typing', we broadcast it to others
  socket.on("typing", () => {
    console.log("typing");
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on("stop typing", () => {
    console.log("stop typing");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    const disconnectedUserId = Object.keys(socketUsers).find(
      (key) => socketUsers[key] === socket.id
    );
    if (disconnectedUserId) {
      delete socketUsers[disconnectedUserId];
      socket.emit("updateOnlineUsers", Object.keys(socketUsers));
    }
  });
});

io.emit("updateOnlineUsers", Object.keys(socketUsers));

httpServer.listen(port, function () {
  console.log(config.get("meta.title") + "Running on : ", port);
});
