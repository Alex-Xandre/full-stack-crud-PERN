import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user-route';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('Hello from TypeScript + Express!');
});

app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
