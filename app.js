import dotenv from 'dotenv';
import 'express-async-errors';
dotenv.config();
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import express from 'express';
import helmet from 'helmet';
import YAML from 'yamljs';
import swaggerUI from 'swagger-ui-express';
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

// import corsOptions from './middlewares/corsOptions.js';
// import orderMiddleware from './middlewares/orderMiddleware.js';

const app = express();
const swaggerDoc = YAML.load('./swagger.yaml')

//! Middlewares 
app.use(express.json());

  //? Extra security packages

app.use(cors());
app.use(helmet());
app.use(rateLimit({
 windowMs:60 * 1000, 
    max: 60
}))
app.get('/', (req, res)=> {
  res.send(`<h1>Welcome to my E-commerce API 
    <br>
    <p style = font-weight: 800;>Click <a href = '/api-docs'>Documentation </a> to go to API documentation</p>
    </h1>`)
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/products',authMiddleware, productsRouter);
app.use('/api/v1/role',authMiddleware, switchRole);
app.use('/api/v1/store', storeRouter);
app.use('/api/v1/orders',authMiddleware, orderRouter)
// app.use('/api/v1', ordersRouter);

app.use(notFound);
app.use(customErrorHandler);

const PORT = process.env.PORT || 3500;

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
