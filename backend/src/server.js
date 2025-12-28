import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

require('dotenv').config();

const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET;
const dbPath = process.env.DB_PATH;
