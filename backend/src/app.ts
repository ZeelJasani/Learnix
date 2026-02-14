/**
 * Express Application Configuration / Express Application Configuration
 *
 * Aa file Express app nu main configuration kare chhe.
 * This file configures the main Express application.
 *
 * Middleware stack / Middleware stack:
 * 1. Helmet - HTTP security headers set kare chhe
 * 2. CORS - Cross-origin requests allow kare chhe
 * 3. Rate Limiting - API abuse prevent kare chhe
 * 4. Morgan - Request logging kare chhe
 * 5. Body Parser - JSON ane URL-encoded bodies parse kare chhe
 * 6. API Routes - Badha API endpoints mount kare chhe
 * 7. Error Handlers - 404 ane general errors handle kare chhe
 */
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import routes from './routes/index';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Express app create karo
// Create the Express application instance
const app: Application = express();

// ========================================
// SECURITY MIDDLEWARE / SECURITY MIDDLEWARE
// ========================================

// Helmet: HTTP response headers set kare chhe security mate
// Helmet: Sets HTTP response headers for security
// Prevents: XSS, clickjacking, MIME sniffing, etc.
app.use(helmet());

// CORS: Frontend ne backend sathe communicate karva dey chhe
// CORS: Allows frontend to communicate with the backend
// Fakat FRONTEND_URL thi requests allow thay chhe
// Only requests from FRONTEND_URL are allowed
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiting: Ek IP thi vadhare requests prevent kare chhe
// Rate Limiting: Prevents too many requests from a single IP
// 15 minute ma maximum 100 requests allow thay chhe
// Maximum 100 requests per IP per 15-minute window
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// ========================================
// LOGGING / LOGGING
// ========================================

// Development ma detailed logging, production ma combined format
// Detailed logging in development, combined format in production
if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: {
            write: (message: string) => logger.info(message.trim()),
        },
    }));
}

// ========================================
// BODY PARSING / BODY PARSING
// ========================================

// JSON body parse kare chhe - 10MB limit sathe
// Parses JSON request bodies with 10MB limit
// Note: Stripe webhook raw body use kare chhe (webhook routes ma handle thay chhe)
// Note: Stripe webhook uses raw body (handled in webhook routes)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========================================
// API ROUTES / API ROUTES
// ========================================

// Badha API routes /api prefix par mount karo
// Mount all API routes under /api prefix
app.use('/api', routes);

// ========================================
// ERROR HANDLING / ERROR HANDLING
// ========================================

// 404 handler - jyare koi route match na thay tyare
// 404 handler - when no route matches the request
app.use(notFoundHandler);

// Global error handler - badhi errors catch kare chhe
// Global error handler - catches all errors
app.use(errorHandler);

export default app;
