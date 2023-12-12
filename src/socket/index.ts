import { Server } from "socket.io";
import { httpServer } from "../app";
import { verifyToken } from "../api/middleware";
import { prisma } from "../db/client";

let socketUsers: { [key: string]: string }[] = [];

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.use(async (socket, next) => {
  const authHeader = socket.handshake.headers.authorization as string;
  const err = new Error("Authentication error");
  console.log('socket middleware');

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
      const isUserIn = socketUsers.find(sockUser => sockUser.userId === user.id)
      if (isUserIn && user.id?.length) {
        socketUsers = socketUsers.map((sockUser) => {
          if (sockUser.userId === user.id) {
            return {
              userId: user.id,
              socketId: socket.id,
            }
          }
          return sockUser;
        })
      } else if (user.id?.length) {
        socketUsers.push({
          userId: user.id,
          socketId: socket.id,
        })
      }
    }
  } catch (error) {
    next(error);
  }
  next();
});

export = {
  io,
  socketUsers
};
