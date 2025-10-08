import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './utils/database';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Starting server...');
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/health`);
      console.log(`✅ API test: http://localhost:${PORT}/api/test`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();