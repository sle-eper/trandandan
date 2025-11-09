import bcrypt from 'bcrypt';
import db from '../DataBase/DataBase.js';
import { validatePassword } from '../Password.js'
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from "axios";



// #########################################################
//                     signup post
// #########################################################

export async function signup_post(request, reply) {
    const {username, email, password, confirmPassword } = request.body;

    try {
        // 1️⃣ Check if the user already exists or mail 
         //const checkStmt = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?');
        const existingUser = await axios.get('http://user-management:3000/profile/User', {
            params: {
                username,
                email,
            }
        });
        if (existingUser.data) {
            console.log('Existing user check response:', existingUser);
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
        const response = await axios.post('http://user-management:3000/profile/create', {
            username,
            email,
            displayName: username,
            password: hashed,
        });
        // reply
        console.log('User creation response:', response.data);
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is missing');
        }
        // ✅ Generate JWT.
        const id = response.data.profile.id;
        console.log('New user ID:', id);
        const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '1min' });
        console.log( '*******************************Generated JWT token:', token);
        // ✅ Send JWT in cookie
        reply
            .code(200)
            .setCookie('token', token, {
                path: '/',
                httpOnly: true
            });

    } catch (err) {
        console.error('Error during registration:', err);
        reply.code(500).send({ success: false, message: 'Internal server error' });
    }
    // return { accessToken: token };
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
// #########################################################

export async function verifyUser_get(request, reply) {
    const token = request.cookies.token;
    if (!token) {
        return reply.code(401).sendFile('login.html');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded payload:', decoded);
        reply
            .code(200)
            .headers({ 'x-user': decoded.username })
            .headers({ 'x-user-id': decoded.id })
            .send({
                authorization: true,
                message: 'You are authenticated to access this resource.'
            })
    } catch (err) {
        return reply.code(401).sendFile('login.html');
    }
    return { accessToken: token };
}

// #########################################################
//               OAuth 
// #########################################################


export async function googleAuth_get(request, reply) {

    const clientId = process.env.Google_ID;
    const redirectUri = process.env.Google_REDIRECT_URI;
    const scope = 'profile email';
    console.log('Google Client ID:', clientId);
    console.log('Google Redirect URI:', redirectUri);
    console.log('Google Scope:', scope);
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    console.log('Google OAuth URL:', googleUrl);
    reply.redirect(googleUrl);
}

export async function githubAuth_get(request, reply) {

    const clientId = process.env.Github_ID;
    const redirectUri = process.env.Github_Redirect_URI;
    const scope = 'user:email';
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    reply.redirect(githubUrl);
}

export async function googleAuthCallback_get(request, reply) {
    const { code } = request.query;
    try {
        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            {
                code,
                Google_ID: process.env.Google_ID,
                Google_SECRET: process.env.Google_SECRET,
                Google_REDIRECT_URI: process.env.Google_REDIRECT_URI,
                grant_type: "authorization_code",
            }
        );
        const { id_token, access_token } = tokenResponse.data;
        const userInfo = jwt.decode(id_token);
        console.log("Google user info:", userInfo);
        console.log('id_token :', id_token);
        const { name, email } = userInfo;
        console.log('User Info:', name, email);
        const token = jwt.sign({ name, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!row) {
            db.prepare('INSERT INTO users (username, email, id_token) VALUES (?, ?, ?)').run(name, email, id_token);
            return reply
                .setCookie('token', token, {
                    path: '/',
                    httpOnly: true,
                })
                .code(400).send({ success: false, message: 'Good' });
        }
        return reply
            .setCookie('token', token, {
                path: '/',
                httpOnly: true,
            })
            .code(200).send({
                success: true,
                message: 'You are Authourised'
            });
    } catch (err) {
        console.error(err);
        reply.status(500).send("Authentication failed");
    }
}


export async function githubAuthCallback_get(request, reply) {
    const { code } = request.query;
    try {
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.Github_ID,
                client_secret: process.env.Github_SECRET,
                code,
            },
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );
        const { access_token } = tokenResponse.data;
        const userInfo = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        console.log("Github user info:", userInfo.data);
        const { name, email } = userInfo.data;
        const token = jwt.sign({ name, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!row) {
            db.prepare('INSERT INTO users (username, email) VALUES (?, ?)').run(name, email);
            return reply
                .setCookie('token', token, {
                    path: '/',
                    httpOnly: true,
                })
                .code(400).send({ success: false, message: 'Good' });
        }
        return reply
            .setCookie('token', token, {
                path: '/',
                httpOnly: true,
            })
            .code(200).send({
                success: true,
                message: 'You are Authourised'
            });
    } catch (err) {
        console.error(err);
        reply.status(500).send("Authentication failed");
    }
}
