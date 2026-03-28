import dotenv from 'dotenv';
dotenv.config();

console.log('--- APP STARTING ---');
import * as fs from 'fs';
fs.writeFileSync('boot.log', 'APP STARTING\n');
import express from 'express';
fs.appendFileSync('boot.log', 'EXPRESS LOADED\n');
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth';
import tasksRouter from './routes/tasks';
import gradesRouter from './routes/grades';
import resourcesRouter from './routes/resources';
import newsRouter from './routes/news';
import adminRouter from './routes/admin';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/resources', express.static(path.join(__dirname, '../resources')));

app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/grades', gradesRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/news', newsRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'JurisMemo API is running.' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
