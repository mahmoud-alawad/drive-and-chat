/* eslint-disable @typescript-eslint/ban-ts-comment */
import {json, Request, Response} from "express";
import {indexRouter} from "./api/index.router";
import config from "config";
import cors from "cors";
import {prisma} from "./db/client";
import {app, httpServer} from "./app";
import {io, logOutUser, socketUsers} from "./socket/index";
import {mediaRouter} from "./api/media.router";
import path from "path";
import fs from "fs";
import {getById} from "./service/user.service";
import catchAsync from "./utils/catchAsync";

app.use(cors({origin: "*"}));

app.use(json({strict: false}));
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

io.on("error", (err) => {
    console.log("socket error");
    console.log(err);
});

io.on("connection", async (socket) => {
    setTimeout(() => {
        io.emit("updateOnlineUsers", socketUsers);
    }, 100);
    socket.on("join", async ({senderId, receiverId}) => {
        console.log("socketio join");
        console.log({senderId, receiverId});

        const room = `${senderId}-${receiverId}`;
        socket.join(room);

        // Load conversation history from the database
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {senderId, receiverId},
                    {senderId: receiverId, receiverId: senderId},
                ],
            },
            include: {
                sender: true,
            },
        });
        io.to(socket.id).emit("loadMessages", messages);
    });

    socket.on("otherUsersMessages", async (otherUsersData) => {
        console.log("otherUsersMessages");
        console.log(otherUsersData);

        const {userId, usersId} = otherUsersData;
        if (usersId && usersId.length) {
            const useMessages = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                  reciverMessages: {
                    orderBy: {    
                        createdAt: 'desc'  // messages for each converastion will be ordered newest first. 
                    }
                  },
                  senderMessages: true,
                },
              })
            console.log(useMessages);
            //@ts-ignore
            io.emit("otherUsersMessages", useMessages?.reciverMessages)
            const userMessages = await usersId.map(async (user: any) => {
                try {
                    const messages = await prisma.message.findMany({
                        where: {
                            senderId: user?.id,
                            receiverId: userId
                        },
                    })

                } catch (error) {
                    console.log(error);

                }

            })


        }
    })
    socket.on("sendMessage", async ({senderId, receiverId, text}) => {
        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                text,
            },
            include: {
                sender: true,
                reciver: true,
            },
        });
        console.log(socket.rooms);
        console.log(socketUsers);

        // const room = `${senderId}-${receiverId}`;
        // io.sockets.in(room).emit('receiveMessage', message);
        const ioSender = socketUsers.find(
            (sockUser) => sockUser?.userId === senderId
        );
        const ioReciver = socketUsers.find(
            (sockUser) => sockUser?.userId === receiverId
        );
        // io.to(room).emit("receiveMessage", message);
        socket.to(ioReciver?.socketId as string).emit("receiveMessage", message);
        socket.to(ioSender?.socketId as string).emit("receiveMessage", message);
    });

    socket.on("message", async (data) => {
        const {senderId, receiverId, text} = data;
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
        const toSend = socketUsers?.find(
            (sockUser: any) => sockUser?.userId === receiverId
        )?.socketId;
        // io.to(socketUsers[senderId]).emit("newMessage", message);
        if (toSend?.length) io.to(toSend).emit("newMessage", message);

        io.emit("message", data);
    });

    socket.on("typing", () => {
        console.log("typing");
    });

    socket.on("stopTyping", () => {
        console.log("stop typing");
    });

    socket.on("logoutUser", logOutUser);

    io.on("disconnect", () => {
        console.log("User logoutUser");
    });
});

httpServer.listen(port, function () {
    console.log(config.get("meta.title") + "Running on : ", port);
});
