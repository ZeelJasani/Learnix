import mongoose from 'mongoose';
import { Quiz } from '../src/models/Quiz';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const COURSE_ID = '6980bab3bba0bb94f993f160';
const USER_ID = 'user_2sYhZq3q4q5q6q7q8q9q0';

async function seedQuiz() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || '');
        console.log('Connected.');

        const quizzes = await Quiz.find({ courseId: COURSE_ID });
        console.log(`Found ${quizzes.length} quizzes for course ${COURSE_ID}`);

        if (quizzes.length > 0) {
            console.log('Sample quiz:', JSON.stringify(quizzes[0], null, 2));
            quizzes.forEach(q => {
                console.log(`- ${q.title} (Published: ${q.isPublished})`);
            });
        } else {
            console.log('No quizzes found. Creating a test quiz...');
            const newQuiz = new Quiz({
                title: 'Test Quiz (verify_db)',
                description: 'Created via script to verify database connection and visibility',
                courseId: COURSE_ID,
                questions: [
                    {
                        type: 'multiple_choice',
                        question: 'Is this working?',
                        options: ['Yes', 'No'],
                        correctAnswer: 'Yes',
                        points: 10
                    }
                ],
                passingScore: 70,
                isPublished: true,
                createdBy: USER_ID
            });
            await newQuiz.save();
            console.log('Test quiz created:', newQuiz._id);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedQuiz();
