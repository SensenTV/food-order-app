import dotenv from 'dotenv';
import app from './app.js';
import { initDB } from './config/initDB.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const DB_PATH = process.env.DB_PATH || './src/database/database.sqlite';

// Initialize database on startup
await initDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
