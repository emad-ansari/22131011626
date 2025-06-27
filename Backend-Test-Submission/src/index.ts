import express, { Application } from 'express';
import urlRoutes from './routes/urlRoutes';
import cors from 'cors'
const app: Application = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/', urlRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Express with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;