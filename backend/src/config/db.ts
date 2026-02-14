/**
 * MongoDB Database Connection / MongoDB Database Connection
 *
 * Aa file MongoDB/Mongoose connection manage kare chhe.
 * This file manages the MongoDB/Mongoose connection.
 *
 * Features / Features:
 * - Connection pooling (max 10 connections)
 * - Auto-reconnect on disconnection
 * - Graceful disconnect support
 * - Connection event monitoring
 */
import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

/**
 * MongoDB sathe connect karo
 * Connect to MongoDB
 *
 * Aa function server startup par call thay chhe.
 * Connection fail thay to process exit kare chhe.
 * This function is called on server startup.
 * If connection fails, the process exits.
 */
export const connectDB = async (): Promise<void> => {
    try {
        // MongoDB sathe connect karo configured options sathe
        // Connect to MongoDB with configured options
        const conn = await mongoose.connect(env.MONGODB_URI, {
            maxPoolSize: 10,                    // Maximum 10 concurrent connections
            serverSelectionTimeoutMS: 5000,     // 5 seconds server selection timeout
            socketTimeoutMS: 45000,             // 45 seconds socket timeout
        });

        logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Connection error event listener
        // Connection ma error aave to log karo
        // Log if error occurs in connection
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        // Disconnect event - auto reconnect attempt thase
        // Disconnect event - auto reconnect will be attempted
        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        // Reconnect success event
        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

    } catch (error) {
        // Connection fail thay to process band karo
        // Exit process if connection fails
        logger.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};

/**
 * MongoDB connection gracefully band karo
 * Gracefully close MongoDB connection
 *
 * Server shutdown samaye call thay chhe.
 * Called during server shutdown.
 */
export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');
    } catch (error) {
        logger.error('Error closing MongoDB connection:', error);
    }
};
