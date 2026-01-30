import { connectDB } from '../lib/db';
import Story from '../models/Story';

const SAMPLE_STORIES = [
    {
        title: 'The Hare and the Tortoise',
        content: `There was once a Hare who was friends with a Tortoise. The Hare was very fast and always bragged about his speed, while the Tortoise was slow and steady. One day, they decided to have a race. The Hare ran very fast and got far ahead. He decided to take a nap. The Tortoise kept walking slowly but surely. When the Hare woke up, he ran to the finish line, but the Tortoise was already there.`,
        level: 1,
        difficulty: 'Beginner',
        quizQuestions: []
    },
    {
        title: 'The History of speed reading',
        content: `Speed reading is not a new concept. In the 1950s, teacher Evelyn Wood coined the term "Reading Dynamics". She observed that some people could read very fast by moving their hand down the page. She taught that by using a pacer and eliminating subvocalization, one could drastically increase reading speed. Modern techniques like RSVP (Rapid Serial Visual Presentation) take this further by eliminating eye movements entirely.`,
        level: 2,
        difficulty: 'Intermediate',
        quizQuestions: []
    },
    {
        title: 'Quantum Computing Brief',
        content: `Quantum computing utilizes the principles of quantum mechanics to perform calculations. Unlike classical computers which use bits that are either 0 or 1, quantum computers use qubits. Qubits can exist in a state of superposition, representing both 0 and 1 simultaneously. This property, along with entanglement, allows quantum computers to solve specific types of complex problems exponentially faster than their classical counterparts.`,
        level: 3,
        difficulty: 'Advanced',
        quizQuestions: []
    }
];

async function seed() {
    console.log('Connecting to DB...');
    try {
        // Hack to make the relative import work with tsx execution context if needed, 
        // but standard import should work if paths are correct. 
        // Note: we are running this from root usually.

        // We need to set the env var manually for the script context as .env.local isn't loaded by tsx
        process.env.MONGODB_URI = 'mongodb+srv://elexier59_db_user:5O3F2M3wvtV2IU3a@cluster0.z0rejes.mongodb.net/focal_db?retryWrites=true&w=majority';

        await connectDB();
        console.log('Connected.');

        console.log('Clearing existing stories...');
        await Story.deleteMany({});

        console.log('Seeding stories...');
        await Story.insertMany(SAMPLE_STORIES);

        console.log('Done! Database seeded with ' + SAMPLE_STORIES.length + ' stories.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
