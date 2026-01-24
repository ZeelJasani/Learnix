import app from '../src/app';
import { connectDB } from '../src/config/db';

// Connect to MongoDB once (connection is cached for serverless)
let isConnected = false;

const handler = async (req: any, res: any) => {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
    return app(req, res);
};

export default handler;
