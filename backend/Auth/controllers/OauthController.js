import jwt from 'jsonwebtoken';
import axios from "axios";



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
        const row = await axios.get('http://user-management:3000/profile/User', {
            params: {
                email,
            }
        });
        if (row.data) {
            return reply
                .setCookie('token', token, {
                    path: '/',
                    httpOnly: true,
                })
                .redirect("http://localhost:5173/")
        }
        else {
            console.log('-----------------------------------------------------', name, '===', email, '===', id_token);
            const response = await axios.post('http://user-management:3000/profile/create', {
                username: name,
                email,
                displayName: name,
                id_token: id_token,
            });
            return reply
                .code(200).send({ success: false, message: 'You are Authourised' });
        }
    } catch (err) {
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
                Accept: "application/vnd.github+json",
            },
        });

        const emails = await axios.get("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: "application/vnd.github+json",
            },
        });

        // 4. Extract primary email
        const primaryEmail = emails.data.find(e => e.primary)?.email;

        // 5. Prepare user data
        const name = userInfo.data.name || userInfo.data.login;
        const email = primaryEmail;

        const token = jwt.sign({ name, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const row = await axios.get('http://user-management:3000/profile/User', {
            params: {
                email,
            }
        });
        if (row.data) {
            return reply
            .setCookie('token', token, {
                path: '/',
                httpOnly: true,
            })
            // .code(200).send({
            //     success: true,
            //     message: 'You are Authourised'
                
            // });
            .redirect("http://localhost:8080/api/auth/signup");
        }
        else {
            
            const response = await axios.post('http://user-management:3000/profile/create', {
                username: name,
                email,
                displayName: name,
                password : access_token,
            });
            return reply
                .setCookie('token', token, {
                    path: '/',
                    httpOnly: true,
                })
                .code(400).send({ success: false, message: 'Good' });
        }

    } catch (err) {
        reply.status(500).send("Authentication failed");
    }
}
