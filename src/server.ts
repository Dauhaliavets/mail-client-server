import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getUser, getUsersByNamePart, updateUsers } from './controllers/user-controller';
import { IMail } from './models/mail';

const PORT = 4000;
const URL = 'mongodb+srv://Task6:Task6@cluster0.aszmb7m.mongodb.net/?retryWrites=true&w=majority';

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
  .connect(URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(`DB connection error: ${err}`));

interface ISocketUser {
  socketId: string;
  userName: string;
}
let connectedUsers: ISocketUser[] = [];

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

  socket.on('message', async ({ newMails }: { newMails: IMail }) => {
    const { from: sender, to: recipient } = newMails;
    await updateUsers(sender, recipient, newMails);

    const [senderSocketUser, recipientSocketUser] = connectedUsers.filter(
      (user) => user.userName === sender || user.userName === recipient,
    );

    io.to([senderSocketUser.socketId, recipientSocketUser.socketId]).emit('messageResponse', newMails);
  });

  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter((user) => user.socketId !== socket.id);
    socket.disconnect();
  });
});

httpServer.listen(PORT, () => console.log(`Server listen port - ${PORT}`));
