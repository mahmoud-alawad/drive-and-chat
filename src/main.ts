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

app.use(cors({ origin: "*" }));


app.use(json({ strict: false }));
app.use(mediaRouter);
app.use((req, res, next) => {
  console.log(req.query.browserCookies);
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

io.on("connection", async (socket) => {
  console.log("User connected");

  socket.on("message", async (data) => {
    console.log(data);
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
    console.log(message);

    // io.to(socket.id).emit("chat message", message);
    // if (io.sockets.sockets[receiverId]) {
    //   io.to(io.sockets.sockets[receiverId].id).emit("chat message", message);
    // }
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(port, function () {
  console.log(config.get("meta.title") + "Running on : ", port);
});
