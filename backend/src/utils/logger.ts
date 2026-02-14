/**
 * Winston Logger Configuration / Winston Logger Configuration
 *
 * Aa file application-wide logging configure kare chhe Winston library vaparaine.
 * This file configures application-wide logging using the Winston library.
 *
 * Features / Features:
 * - Development ma debug level logging
 * - Production ma info level + file-based logging
 * - Colored console output
 * - Error stack trace support
 * - Timestamped log entries
 */
import winston from 'winston';
import { env } from '../config/env';

// Winston format utilities destruct karo
// Destructure Winston format utilities
const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Custom log format - timestamp, level, ane message/stack batave chhe
 * Custom log format - shows timestamp, level, and message/stack
 *
 * Format: "2024-01-15 14:30:00 [info]: Server started on port 5000"
 */
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

/**
 * Winston logger instance
 *
 * Development: debug level - badhu log thay chhe
 * Production: info level - fakat important logs thay chhe
 *
 * Development: debug level - everything is logged
 * Production: info level - only important logs are captured
 */
export const logger = winston.createLogger({
    // Development ma verbose logging, production ma concise
    // Verbose logging in development, concise in production
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',

    // Base format: error stacks + timestamps
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),

    // Console transport - colored output terminal ma
    // Console transport - colored output in terminal
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                logFormat
            ),
        }),
    ],
});

// Production ma file-based logging add karo
// Add file-based logging in production
if (env.NODE_ENV === 'production') {
    // Error-only log file - fakat errors capture thay chhe
    // Error-only log file - captures only errors
    logger.add(
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
    );

    // Combined log file - badha levels na logs
    // Combined log file - logs from all levels
    logger.add(
        new winston.transports.File({ filename: 'logs/combined.log' })
    );
}
