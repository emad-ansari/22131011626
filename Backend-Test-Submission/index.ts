import express, { Application } from 'express';
import urlRoutes from './src/routes/urlRoutes';
import cors from 'cors'

const app: Application = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', urlRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Express with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;