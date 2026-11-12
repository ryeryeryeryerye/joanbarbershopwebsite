import { createApp } from './app';
import { ENV } from './config/env';
import { connectDatabase } from './config/db';
import { runSeed } from './seed/seedData';
import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
  // Connect to Database (handles offline gracefully in scaffold mode)
  await connectDatabase();

  // Tự động khởi tạo dữ liệu mẫu nếu database mới chưa có
  try {
    await runSeed();
  } catch (seedErr) {
    logger.warn('Seed dữ liệu mẫu không thành công:', seedErr);
  }

  const app = createApp();

  app.listen(ENV.PORT, () => {
    logger.info(`Server is running at http://localhost:${ENV.PORT}`);
    logger.info(`API Health check: http://localhost:${ENV.PORT}/api/v1/health`);
    logger.info(`Environment: ${ENV.NODE_ENV}`);
  });
};

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

