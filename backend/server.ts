import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import users from './routes/users';
import mining from './routes/mining';

dotenv.config();

async function main() {
  await connectDB(process.env.MONGO_URI!);
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/mining', mining);
  app.get('/health', (_, res) => res.json({ ok: true }));
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => console.log(`Server listening on :${port} ✅`));
}
main().catch(err => { console.error(err); process.exit(1); });
