import mongoose from 'mongoose';
import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';

const PORT = 8080;
const URL = 'mongodb+srv://Task6:Task6@cluster0.aszmb7m.mongodb.net/?retryWrites=true&w=majority';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

mongoose.set('strictQuery', false);

mongoose
  .connect(URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(`DB connection error: ${err}`));

io.on('connection', (socket) => {
  console.log('WebSocket connection');
  console.log(socket.id);
});

httpServer.listen(PORT, () => console.log(`Server listen port - ${PORT}`));
