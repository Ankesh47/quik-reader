import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // Index of correct option
}

export interface IStory extends Document {
    title: string;
    content: string;
    level: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    quizQuestions: IQuizQuestion[];
    createdAt: Date;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }
});

const StorySchema = new Schema<IStory>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    level: { type: Number, required: true, index: true }, // Index for faster searching by level
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    quizQuestions: [QuizQuestionSchema],
    createdAt: { type: Date, default: Date.now }
});

// Prevent overwriting model during hot-reload
const Story: Model<IStory> = mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema);

export default Story;
