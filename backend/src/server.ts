/**
 * Learnix Backend Server Entry Point / Learnix Backend Server Entry Point
 *
 * Aa file server nu main entry point chhe je Express app start kare chhe.
 * This file is the main entry point that starts the Express application.
 *
 * Kaam / Functions:
 * 1. MongoDB database sathe connect kare chhe
 * 2. Express HTTP server start kare chhe
 * 3. Graceful shutdown handle kare chhe (SIGTERM, SIGINT)
 * 4. Unhandled errors ane rejections catch kare chhe
 */
import app from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { logger } from './utils/logger';

/**
 * Server start karva mate main function
 * Main function to start the server
 *
 * Aa async function chhe je:
 * 1. Pahela MongoDB connect kare chhe
 * 2. Pachi Express app ne specified port par listen krave chhe
 * 3. Graceful shutdown handlers setup kare chhe
 */
const startServer = async (): Promise<void> => {
    try {
        // MongoDB sathe connect karo
        // Connect to MongoDB database
        await connectDB();

        // Express server start karo specified port par
        // Start Express server on specified port
        const server = app.listen(env.PORT, () => {
            logger.info(`🚀 Server running on port ${env.PORT}`);
            logger.info(`📚 Environment: ${env.NODE_ENV}`);
            logger.info(`🔗 API URL: http://localhost:${env.PORT}/api`);
            logger.info(`❤️  Health check: http://localhost:${env.PORT}/api/health`);
        });

        /**
         * Graceful shutdown handler
         * Server ne safely band karva mate function
         *
         * Jyare SIGTERM ke SIGINT signal aave tyare:
         * 1. Nava requests accept karvanu bandh kare chhe
         * 2. Database connection close kare chhe
         * 3. Process exit kare chhe
         * 4. 10 seconds ma band na thay to forcefully exit kare chhe
         *
         * When SIGTERM or SIGINT signal is received:
         * 1. Stops accepting new requests
         * 2. Closes database connection
         * 3. Exits the process
         * 4. Force exits if not closed within 10 seconds
         */
        const gracefulShutdown = async (signal: string): Promise<void> => {
            logger.info(`\n${signal} received. Shutting down gracefully...`);

            server.close(async () => {
                logger.info('HTTP server closed');

                // Database connection close karo
                // Close the database connection
                await disconnectDB();

                logger.info('Process terminated');
                process.exit(0);
            });

            // 10 seconds ma band na thay to forcefully shut down karo
            // Force shutdown after 10 seconds if graceful shutdown fails
            setTimeout(() => {
                logger.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        // OS signals handle karo graceful shutdown mate
        // Handle OS signals for graceful shutdown
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Unhandled promise rejections catch karo
        // Catch unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });

        // Uncaught exceptions catch karo
        // Catch uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });

    } catch (error) {
        // Server start na thay to error log karo ane exit karo
        // Log error and exit if server fails to start
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Server start karo
// Start the server
startServer();
