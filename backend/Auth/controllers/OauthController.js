import jwt from 'jsonwebtoken';
import axios from "axios";
import qs from "qs";


// #########################################################
//               OAuth 
// #########################################################


export async function googleAuth_get(request, reply) {

    const clientId = process.env.Google_ID;
    const redirectUri = process.env.Google_REDIRECT_URI;
    const scope = 'profile email';
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
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
        const tokenPayload = {
            code,
            client_id: process.env.Google_ID,
            client_secret: process.env.Google_SECRET,
            redirect_uri: process.env.Google_REDIRECT_URI,
            grant_type: "authorization_code",
        };

        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            qs.stringify(tokenPayload),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        const { id_token, access_token } = tokenResponse.data;
        const userInfo = jwt.decode(id_token);
        const { name, email } = userInfo;
        const row = await axios.get('http://user-management:3000/profile/User', {
            params: {
                email,
            }
        });
        if (row.data) {
            const token = jwt.sign({ id: row.data.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return reply
                .setCookie('token', token, {
                    path: '/',
                    httpOnly: true,
                })
                .redirect(`/auth/callback?token=${token}`);

        }
        else {
            const response = await axios.post('http://user-management:3000/profile/create', {
                username: name,
                email,
                displayName: name,
                id_token: id_token,
            });
            const token = jwt.sign({ id: response.data.profile.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return reply
                .setCookie('token', token, { path: '/', httpOnly: true })
                .redirect(`/auth/callback?token=${token}`);

        }

    } catch (err) {
        reply.status(500).send("Authentication failed");
    }
}

export async function githubAuthCallback_get(request, reply) {
    const { code } = request.query;
    try {
        // 1. Exchange code for access token
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

        // 2. Get user info
        const userInfo = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: "application/vnd.github+json",
            },
        });

        // 3. Get primary email
        const emails = await axios.get("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: "application/vnd.github+json",
            },
        });
        const primaryEmail = emails.data.find(e => e.primary)?.email;

        if (!primaryEmail) {
            return reply.status(400).send({ success: false, message: "No primary email found" });
        }

        // 4. Prepare user data
        const name = userInfo.data.name || userInfo.data.login;
        const email = primaryEmail;

        // 5. Create JWT token
        
        // 6. Check if user exists
        const row = await axios.get('http://user-management:3000/profile/User', {
            params: { email }
        });
        
        if (row.data) {
            // User exists → redirect with token
            const token = jwt.sign({ id: row.data.id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return reply
            .setCookie('token', token, { path: '/', httpOnly: true })
            .redirect(`/auth/callback?token=${token}`);
        } else {
            // User doesn't exist → create profile
            const response = await axios.post('http://user-management:3000/profile/create', {
                username: name,
                email,
                displayName: name,
                id_token: access_token,
            });
            const token = jwt.sign({ id: response.data.profile.id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return reply
                .setCookie('token', token, { path: '/', httpOnly: true })
                .redirect(`/auth/callback?token=${token}`);
        }

    } catch (err) {
        return reply.status(500).send({ success: false, message: "Authentication failed" });
    }
}
