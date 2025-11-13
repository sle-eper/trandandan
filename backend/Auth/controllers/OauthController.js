
import jwt from 'jsonwebtoken';
import axios from "axios";


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
    reply.redirect(googleUrl);
}

export async function githubAuth_get(request, reply) {

    console.log('------------------------------------------------------------------------------------');
    const clientId = process.env.Github_ID;
    console.log('Github Client ID:', clientId);
    const redirectUri = process.env.Github_Redirect_URI;
    const scope = 'user:email';
    console.log('Github Redirect URI:', redirectUri);
    console.log('Github Scope:', scope);
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    console.log('Github OAuth URL:', githubUrl);
    reply.redirect(githubUrl);
}

export async function googleAuthCallback_get(request, reply) {
    const { code } = request.query;
    try {
        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            {
                code,
                client_id: process.env.Google_ID,
                client_secret: process.env.Google_SECRET,
                redirect_uri: process.env.Google_REDIRECT_URI,
                grant_type: "authorization_code",
            }
        );
        const { id_token, access_token } = tokenResponse.data;
        const userInfo = jwt.decode(id_token);
        const { name, email } = userInfo;
        const token = jwt.sign({ name, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!row) {
            db.prepare('INSERT INTO users (username, email, id_token) VALUES (?, ?, ?)').run(name, email, id_token);
            return reply
                .setCookie('token', token, {
                    path: '/',
                    httpOnly: true,
                })
                .code(400).send({ success: false, message: 'You are Authourised' });
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
    console.log('------------------------------------------------------------------------------------');
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
        const row = await axios.get('http://user-management:3000/profile/User', {
            params: {
                name,
                email,
            }
        });
        if (!row) {
            const response = await axios.post('http://user-management:3000/profile/create', {
                name,
                email,
                displayName: name,
                token_id: access_token,
            });
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
