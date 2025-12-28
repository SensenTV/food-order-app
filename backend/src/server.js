require('dotenv').config();

const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET;
const dbPath = process.env.DB_PATH;
