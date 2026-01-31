import app from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start the server
        const server = app.listen(env.PORT, () => {
            logger.info(`🚀 Server running on port ${env.PORT}`);
            logger.info(`📚 Environment: ${env.NODE_ENV}`);
            logger.info(`🔗 API URL: http://localhost:${env.PORT}/api`);
            logger.info(`❤️  Health check: http://localhost:${env.PORT}/api/health`);
            logger.info('🔄 Server forced restart for validation fix');
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal: string): Promise<void> => {
            logger.info(`\n${signal} received. Shutting down gracefully...`);

            server.close(async () => {
                logger.info('HTTP server closed');

                await disconnectDB();

                logger.info('Process terminated');
                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
