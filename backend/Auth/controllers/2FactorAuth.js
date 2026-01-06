import jwt from "jsonwebtoken";
import axios from "axios";
import QRCode from "qrcode";
import speakeasy from "speakeasy";
import dotenv from "dotenv";
dotenv.config();


// #########################################################
//                Two Factor Controllers()
// #########################################################

export async function twofactorlogin_post(request, reply) {
    const { username, code } = request.body;

    const row = await axios.get("http://user-management:3000/profile/User", {
        params:
        {
            username,
        }
    });
    if (!row.data) {
        return reply.code(400).send({ success: false, message: "User not found" });
    }

    const secret = row.data.two_factor_secret;
    const isValid = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: code,
        window: 1
    });
    if (!isValid) {
        return reply.code(400).send({ success: false, message: "Invalid 2FA code" });
    }
    const token = jwt.sign(
        { id: row.data.id, username },
        process.env.JWT_SECRET,
        { expiresIn: "10000h" }
    );
    // ✅ Send JWT in cookie
    reply
        .setCookie("token", token, {
            path: "/",
            httpOnly: true,
            sameSite: "none",
            secure: true,
        })
        .header('x-user', row.data.username)
        .header('x-user-id', row.data.id)
        .code(200).send({ success: true, message: "You are Authourised" });

}

export async function twofactor_get(request, reply) {
    const token = request.cookies.token;

    if (!token) {
        return reply.code(401).send({ error: "Not Authorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;
    const row = await axios.get("http://user-management:3000/profile/User", {
        params: {
            username,
        },
    });
    if (!row) {
        return reply.code(400).send({ success: false, message: "User not found" });
    }
    if (String(row.data.two_factor_enabled) === "true") {
        return reply.code(400).send({ success: false, message: "2FA is already enabled for this user" });
    }
    //generate secret 
    let secret = null;
    if (row.data.two_factor_secret === null) {
        secret = speakeasy.generateSecret({
            name: `YourApp:${row.data.email}`,
            issuer: "YourApp",
            digits: 6,
            period: 30,
            window: 1
        });
        await axios.put("http://user-management:3000/User/two-factor-secret", {
            username,
            two_factor_secret: secret.base32,
        });
        const qrImage = await QRCode.toDataURL(secret.otpauth_url);
        return reply.code(200)
            .send({ qrImage })
    }
    secret = row.data.two_factor_secret;
    const otpauth = speakeasy.otpauthURL({
        secret: secret,
        encoding: "base32",
        label: "trandandan:Soumaya",
        issuer: "trandandan"
    });
    const qrImage = await QRCode.toDataURL(otpauth);
    return reply.code(200)
        .send({ qrImage })
}


export async function verify2fa_post(request, reply) {
    //get code from DB 
    const { code } = request.body;
    const token = request.cookies.token;
    if (!token) {
        return reply.code(401).send({ error: "Not Authorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;
    const row = await axios.get("http://user-management:3000/profile/User", {
        params: {
            username,
        },
    });
    if (!row.data) {
        return reply.code(400).send({ success: false, message: "User not found" });
    }
    const secret = row.data.two_factor_secret;
    const isValid = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: code,
        window: 1
    });
    if (!isValid) {
        return reply.code(400).send({ success: false, message: "Invalid 2FA code" });
    }
    if (Number(row.data.two_factor_enabled) === 0) {
        await axios.put("http://user-management:3000/User/enable-two-factor", {
            username,
        });
    }
    return reply.code(200).send({ success: true, message: "2FA verified successfully" });
}
