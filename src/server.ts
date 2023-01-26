import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getUser, getUsersByNamePart, updateUsers } from './controllers/user-controller';
import { IMail } from './models/mail';
import { ISocketUSer } from './models/socketUser';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.DB_URL as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(`DB connection error: ${err}`));

let connectedUsers: ISocketUSer[] = [];

io.on('connection', (socket) => {
  socket.on('signIn', async ({ userName }) => {
    const user = await getUser(userName);
    connectedUsers.push({ socketId: socket.id, userName });
    io.to(socket.id).emit('signInResponse', user);
  });

  socket.on('selectUser', async ({ partName }) => {
    const selectedUsers = await getUsersByNamePart(partName);
    io.to(socket.id).emit('selectUserResponse', selectedUsers);
  });

  socket.on('message', async ({ newMail }: { newMail: IMail }) => {
    const { from: sender, to: recipient } = newMail;
    await updateUsers(sender, recipient, newMail);

    const foundSocketIds = connectedUsers
      .filter((user) => user.userName === sender || user.userName === recipient)
      .map((user) => user.socketId);

    io.to([...foundSocketIds]).emit('messageResponse', newMail);
  });

  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter((user) => user.socketId !== socket.id);
    socket.disconnect();
  });
});

httpServer.listen(process.env.PORT, () => console.log(`Server listen port - ${process.env.PORT}`));
