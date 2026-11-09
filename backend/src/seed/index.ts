import { connectDatabase } from '../config/db';
import { runSeed } from './seedData';
import { logger } from '../utils/logger';

async function main() {
  try {
    await connectDatabase();
    await runSeed();
    process.exit(0);
  } catch (error) {
    logger.error('Lỗi khi chạy seed dữ liệu:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export * from './seedData';

