import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const DB_PATH = process.env.DB_PATH || './src/database/database.sqlite';

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
