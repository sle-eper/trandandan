import Fastify from 'fastify';
import formbody from '@fastify/formbody'; // for HTML form POST
import db from './DataBase.js';
import { validatePassword } from './Password.js';
import bcrypt from 'bcrypt';



const fastify = Fastify({ logger: true });

await fastify.register(formbody);


fastify.get('/', (req, reply) => {
    return { message: 'Hello, Fastify!' };

});

fastify.post('/login', async (req, reply) => {
    const { username, password } = req.body;
    const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!row) {
        return reply.code(400).send({ success: false, message: 'User not found' });
    }
    // 2️⃣ Compare hashed password
    const match = await bcrypt.compare(password, row.password);
    if (!match) {
        return reply.code(400).send({ success: false, message: 'Invalid password' });
    }

    // 3️⃣ Return success
    return reply.redirect('http://localhost:5500/Login/WelcomePage.html');
});
fastify.post('/register', async (req, reply) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        // 1️⃣ Check if the user already exists or mail 
        const checkStmt = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?');
        const existingUser = checkStmt.get(username, email); // .get() returns one row or undefined

        if (existingUser) {
            return reply.code(400).send({
                success: false,
                message: 'User already exists!'
            });
        }
        if (username.length < 4) {
            return reply.code(400).send({
                success: false,
                message: 'User must be at least 4 characters'
            });
        }
        //  2️⃣ password
        if (password.length < 8) {
            return reply.code(400).send({ message: 'Password must be at least 8 characters long' });
        }
        if (password !== confirmPassword) {
            return reply.code(400).send({ success: false, message: 'Passwords do not match.' });
        }
        const { valid, errors } = validatePassword(password, { minLen: 8 });
        if (!valid) {
            return reply.code(400).send({ success: false, message: 'Weak password.', errors });
        }
        const hashed = await bcrypt.hash(password, 10); // saltRounds = 10
        const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
        stmt.run(username, email, hashed);

        // reply
        return reply.redirect('http://localhost:5500/Login/WelcomePage.html');


    } catch (err) {
        console.error('Error during registration:', err);
        reply.code(500).send({ success: false, message: 'Internal server error' });
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server listening on port 3000');
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();

