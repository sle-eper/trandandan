import bcrypt from 'bcrypt';
import db from '../DataBase/DataBase.js';
import { validatePassword } from '../Password.js'
import jwt from 'jsonwebtoken';


// #########################################################
//                     signup post
// #########################################################
export async function signup_post(request, reply) {
    const { username, email, password, confirmPassword } = request.body;

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
        const hashed = await bcrypt.hash(password, 10);
        const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');

        // reply
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is missing');
        }
        // ✅ Generate JWT
        const result = stmt.run(username, email, hashed);
        const id = result.lastInsertRowid;
        const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // ✅ Send JWT in cookie
        reply
            .setCookie('token', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 3
            })
            .code(200).send({
                success: false,
                message: 'You are Authourised'
            });
    } catch (err) {
        console.error('Error during registration:', err);
        reply.code(500).send({ success: false, message: 'Internal server error' });
    }
}

// #########################################################
//                     login post
// #########################################################

export async function login_post(request, reply) {
    const { username, password } = request.body;
    console.log('🔍 Login attempt:', username, password);
    const authHeader = request.headers['authorization'];
    const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!row) {
        return reply.code(400).send({ success: false, message: 'User not found' });
    }
    const match = await bcrypt.compare(password, row.password);
    if (!match) {
        return reply.code(400).send({ success: false, message: 'Invalid password' });
    }
    const token = jwt.sign({ id: row.id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // ✅ Send JWT in cookie
    reply
        .setCookie('token', token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3
        })
        .code(200).send({
            success: false,
            message: 'You are Authourised'
        });

}

// #########################################################
//                     Get Functions
// #########################################################

export async function login_get(request, reply) {
    return reply.sendFile('login.html');
}

export async function signup_get(request, reply) {
    return reply.sendFile('register.html');
}
