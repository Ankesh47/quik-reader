import { connectDB } from '../lib/db';
import User from '../models/User';
import fs from 'fs';
import path from 'path';

async function setAdmin() {
    const username = process.argv[2];

    if (!username) {
        console.error('❌ Please provide a username.');
        console.log('Usage: npx tsx src/scripts/set-admin.ts <username>');
        process.exit(1);
    }

    // Load .env.local manually so we don't need dotenv dependency
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const envFile = fs.readFileSync(envPath, 'utf8');
            const uriLine = envFile.split('\n').find(line => line.startsWith('MONGODB_URI='));
            if (uriLine) {
                const parts = uriLine.split('=');
                // Rejoin in case the password has an = sign, but remove key
                parts.shift();
                process.env.MONGODB_URI = parts.join('=').trim();
            }
        }
    } catch (e) {
        console.warn('Could not read .env.local, checking process.env...');
    }

    try {
        console.log(`Connecting to DB...`);
        await connectDB();

        console.log(`Searching for user: ${username}...`);
        const user = await User.findOne({ username });

        if (!user) {
            console.error(`❌ User '${username}' not found.`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`✅ Success! User '${username}' is now an Admin.`);
        console.log('You can now access /admin');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

setAdmin();
