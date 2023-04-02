import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from 'errorhandler';
import IndexRouter from './src/index';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT;

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler({ log: true }));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(IndexRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
