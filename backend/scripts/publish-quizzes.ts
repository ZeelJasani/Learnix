import mongoose from 'mongoose';
import { Quiz } from '../src/models/Quiz';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.join(process.cwd(), '.env') });

const COURSE_ID = '6980bab3bba0bb94f993f160';

async function publishQuizzes() {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!uri) throw new Error("No MongoDB URI found in .env");

        console.log('Connecting to MongoDB...', uri.substring(0, 20) + '...');
        await mongoose.connect(uri);
        console.log('Connected.');

        const quizzes = await Quiz.find({ courseId: COURSE_ID });
        console.log(`Found ${quizzes.length} quizzes.`);

        if (quizzes.length > 0) {
            const result = await Quiz.updateMany(
                { courseId: COURSE_ID },
                { $set: { isPublished: true } }
            );
            console.log(`Updated ${result.modifiedCount} quizzes to Published status.`);
        } else {
            console.log("No quizzes found to publish.");
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

publishQuizzes();
