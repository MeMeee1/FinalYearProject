import 'dotenv/config';
import express, { json, urlencoded, Request } from 'express';
import cors from 'cors';
import productsRoutes from './routes/products/index.js';
import authRoutes from './routes/auth/index.js';
import usersRoutes from './routes/users/index.js';
import ordersRoutes from './routes/orders/index.js';
import vendorsRoutes from './routes/vendors/index.js';
import adminRoutes from './routes/admin/index.js';
import uploadRoutes from './routes/upload/index.js';
import reviewsRoutes from './routes/reviews.js';
import fulfillmentPointsRoutes from './routes/fulfillmentPoints.js';
// import stripeRoutes from './routes/stripe/index.js';

import serverless from 'serverless-http';

const port = 3001;
const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(
  json({
    verify: (req: Request, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/ping/:id', (req, res) => {
  console.log(req.params);
  res.send('pong');
});

app.use('/products', productsRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/orders', ordersRoutes);
app.use('/vendors', vendorsRoutes);
app.use('/admin', adminRoutes);
app.use('/upload', uploadRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/fulfillment-points', fulfillmentPointsRoutes);
// app.use('/stripe', stripeRoutes);

if (process.env.NODE_ENV === 'dev') {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

export const handler = serverless(app);
