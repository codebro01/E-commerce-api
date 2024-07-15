import dotenv from 'dotenv';
import 'express-async-errors';
dotenv.config();
import cors from 'cors';
import express from 'express';
import connectDB from './DB/connectDB.js';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import switchRole from './routes/switchRoles.js'
import storeRouter from './routes/store.js'
import orderRouter from './routes/orders.js'
import notFound from './middlewares/notFoundMIddleware.js';
import customErrorHandler from './middlewares/errorMiddleware.js';
import authMiddleware from './middlewares/authMiddleware.js';
import checkRole from './middlewares/checkRoleMiddleware.js';
import helmet from 'helmet';

// import corsOptions from './middlewares/corsOptions.js';
// import orderMiddleware from './middlewares/orderMiddleware.js';

const app = express();


//! Middlewares 
app.use(express.json());
app.use(cors());
app.use(helmet())


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/products',authMiddleware, productsRouter);
app.use('/api/v1/role',authMiddleware, switchRole);
app.use('/api/v1/store', storeRouter);
app.use('/api/v1/orders',authMiddleware, orderRouter)
// app.use('/api/v1', ordersRouter);

app.use(notFound);
app.use(customErrorHandler);

const PORT = 3500;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`App is listening at port: ${PORT}`))
}
catch (err) {
    console.log('There was an error in the Connection:' + err)
}
  } 

start()
