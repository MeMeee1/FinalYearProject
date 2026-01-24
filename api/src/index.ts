import 'dotenv/config';
import express, { json, urlencoded, Request } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import productsRoutes from './routes/products/index.js';
import authRoutes from './routes/auth/index.js';
import usersRoutes from './routes/users/index.js';
import ordersRoutes from './routes/orders/index.js';
import vendorsRoutes from './routes/vendors/index.js';
import adminRoutes from './routes/admin/index.js';
import uploadRoutes from './routes/upload/index.js';
import fulfillmentPointsRoutes from './routes/fulfillmentPoints.js';
import serverless from 'serverless-http';

const port = 3001;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(urlencoded({ extended: false }));
app.use(
  json({
    verify: (req: Request, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/products', productsRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/orders', ordersRoutes);
app.use('/vendors', vendorsRoutes);
app.use('/admin', adminRoutes);
app.use('/upload', uploadRoutes);
app.use('/fulfillment-points', fulfillmentPointsRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join', (room) => {
    console.log(`Socket ${socket.id} joining room: ${room}`);
    socket.join(room);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

if (!process.env.NODE_ENV || process.env.NODE_ENV.trim() === 'dev') {
  httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port} with WebSockets`);
  });
}

export const handler = serverless(app);
export { io };
