import bcrypt from 'bcrypt';
import db from '../DataBase/DataBase.js';
import { validatePassword } from '../Password.js'
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';



// #########################################################
//                     signup post
// #########################################################

export async function signup_post(request, reply) {
    const { username, email, password, confirmPassword } = request.body;

    try {
        // 1️⃣ Check if the user already exists or mail 
        const checkStmt = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?');
        const existingUser = checkStmt.get(username, email);

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
        const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '1min' });

        // ✅ Send JWT in cookie
        const __Dir = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__Dir);

        const __filename = path.join(__dirname, '../public/authorized.html');
        const fileStream = fs.createReadStream(__filename);
        reply
            .setCookie('token', token, {
                path: '/',
                httpOnly: true
            })
            .code(200).send(fileStream);

    } catch (err) {
        console.error('Error during registration:', err);
        reply.code(500).send({ success: false, message: 'Internal server error' });
    }
    return { accessToken: token };
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
    const token = jwt.sign({ id: row.id, username }, process.env.JWT_SECRET, { expiresIn: '1min' });
    // ✅ Send JWT in cookie
    reply
        .setCookie('token', token, {
            path: '/',
            httpOnly: true,
        })
        .code(200).send({
            success: true,
            message: 'You are Authourised'
        });
    return { accessToken: token };

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


// #########################################################
//                Verify User Get Function()
// should NOT be available to be accessed directly by the client i have to protect this endpoint
// after merging 
// #########################################################
export async function verifyUser_get(request, reply) {
    const token = request.cookies.token;
    if (!token) {
        return reply.code(401).sendFile('login.html');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded payload:', decoded);
    } catch (err) {
        return reply.code(401).sendFile('login.html');
    }
    reply.code(200).send({
        authorization: true,
        message: 'You are authenticated to access this resource.'
    })
    return { accessToken: token };
}

// #########################################################
//                Remote Auth 
// #########################################################


export async function googleAuth_get(request, reply){   
    // Implementation for Google Auth

    console.log(request.headers);
    return reply.code(200).send({
        success: true,
        message: 'Google Auth endpoint'
    });
}

export async function githubAuth_get(request, reply){   
    // Implementation for GitHub Auth

    console.log(request.headers);
    return reply.code(200).send({
        success: true,
        message: 'Github Auth endpoint'
    });
}