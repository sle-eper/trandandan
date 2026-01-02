import bcrypt from "bcrypt";
import { validatePassword } from "../MyConfig.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import crypto from "crypto";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import speakeasy from "speakeasy";
import dotenv from "dotenv";
dotenv.config();
// #########################################################
//                     signup post
// #########################################################

export async function signup_post(request, reply) {
  const { username, email, password, confirm } = request.body;

  try {
    const existingUser = await axios.get(
      "http://user-management:3000/profile/User",
      {
        params: {
          username,
          email,
        },
      }
    );
    console.log("🔍 Existing user check:", existingUser.data);
    if (existingUser.data) {
      return reply.code(400).send({
        success: false,
        message: "User already exists!",
      });
    }
    if (username.length < 4) {
      return reply.code(400).send({
        success: false,
        message: "User must be at least 4 characters",
      });
    }
    //  2️⃣ password
    if (password.length < 8) {
      return reply
        .code(400)
        .send({ message: "Password must be at least 8 characters long" });
    }
    if (password !== confirm) {
      return reply
        .code(400)
        .send({ success: false, message: "Passwords do not match." });
    }
    const { valid, errors } = validatePassword(password, { minLen: 8 });
    if (!valid) {
      return reply
        .code(400)
        .send({ success: false, message: "Weak password.", errors });
    }
    const hashed = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashed);
    const response = await axios.post(
      "http://user-management:3000/profile/create",
      {
        username,
        email,
        displayName: username,
        password: hashed,
      }
    );
    // reply
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }
    // ✅ Generate JWT.
    const id = response.data.profile.id;
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
      expiresIn: "10000h",
    });
    // ✅ Send JWT in cookie
    return reply
      .setCookie("token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .code(200).send({
        success: true,
        message: "Registration successful",
      });
  } catch (err) {
    console.error("Error during registration:", err);
    return reply.code(500).send({ success: false, message: "Internal server error" });
  }
  // return { accessToken: token };
}


// #########################################################
//                     login post
// #########################################################
export async function login_post(request, reply) {
  const { username, password } = request.body;
  console.log("🔍 Login attempt:", username, password);
  const authHeader = request.headers["authorization"];
  const row = await axios.get("http://user-management:3000/profile/User", {
    params: {
      username,
    },
  });
  console.log("🔍 User fetched from user-management:", row.data);
  if (!row) {
    return reply.code(400).send({ success: false, message: "User not found" });
  }
  if (Number(row.data.two_factor_enabled) === 1) {
    console.log("🔍 2FA is enabled for this user.");
    console.log("🔍 Redirecting to 2FA verification.");
    return reply.code(206).send({ success: true, message: "2FA required" });
  }
  console.log("🔍 Comparing passwords");
  console.log(row.data.password_hash);

  const match = await bcrypt.compare(password, row.data.password_hash);
  if (!match) {
    return reply
      .code(400)
      .send({ success: false, message: "Invalid password" });
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
    .code(200).send({ success: true, message: "You are Authourised" });
  return { accessToken: token };
}
// #########################################################
//                     logout post
// #########################################################

export async function logout_post(request, reply) {
  const token = request.cookies.token;
  if (!token) {
    return reply.code(400).send({ success: false, message: "No token found" });
  }
  return reply
    .clearCookie("token", {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .code(200).send({ success: true, message: "You are logged out" });
}

// #########################################################
//                Verify User Get Function()
// #########################################################

export async function verifyUser_get(request, reply) {
  const token = request.cookies.token;
  if (!token) {
    return reply.code(401).send({ error: "Not Authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return reply
      .code(200)
      .header('x-user', decoded.username)
      .header('x-user-id', decoded.id)
      .send({
        authorization: true,
        message: "You are authenticated to access this resource.",
        id: decoded.id,
        username: decoded.username
      });
  } catch (err) {
    console.log(' Token verification failed:', err.message);
    return reply.code(401).send({ error: "Not authorized" });
  }
}

// #########################################################
//                Forget Password Controllers()
// #########################################################

export async function forgetPassword_post(request, reply) {
  const { email } = request.body;
  console.log("Password reset requested for email:", email);
  //check if email exists in DB 
  try {
    const row = await axios.get("http://user-management:3000/profile/User", {
      params: {
        email,
      },
    });
    if (!row.data) {
      return reply.code(400).send({ success: false, message: "User not found" });
    }
    let transporter = nodemailer.createTransport({
      host: process.env.STMP_HOST,
      port: process.env.STMP_PORT,
      secure: false,
      auth: {
        user: process.env.STMP_MAIL,
        pass: process.env.STMP_PASS,
      },
    });
    const crypto = await import("crypto");
    const token = crypto.randomBytes(20).toString("hex");
    await axios.put("http://user-management:3000/User/TokenId", {
      username: row.data.username,
      token: token,
    });
    const resetUrl = `https://localhost:/change?token=${token}`;
    let mailOptions = {
      from: '"My App" <soumayaaitammi2023@gmail.com>',
      to: email,
      subject: "Reset Your Password",
      text: `Click this link to reset your password: ${resetUrl}`,
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error:", error);
      }
    });
    return reply.code(200).send({ success: true, message: "Reset link sent to email" });
  } catch (err) {
    reply.code(500);
    return { error: "Failed to send email", details: err.message };
  }
  //send mail with reset link 
}

export async function resetPassword_post(request, reply) {
  const { token, newPassword, confirmPassword } = request.body;
  console.log("Password change requested with token:", token);
  console.log("passwords:", newPassword, confirmPassword);
  if (newPassword !== confirmPassword) {
    return reply.code(400).send({ success: false, message: "Passwords do not match." });
  }
  try {
    const row = await axios.get("http://user-management:3000/profile/User", {
      params:
      {
        token,
      }
    });
    if (!row.data) {
      console.log("Invalid or expired token");
      return reply.code(400).send({ success: false, message: "Invalid or expired token" });
    }
    const { valid, errors } = validatePassword(newPassword, { minLen: 8 });
    if (!valid) {
      return reply
        .code(400)
        .send({ success: false, message: "Weak password.", errors });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    console.log("Hashed new password:", hashed);
    await axios.put("http://user-management:3000/User/changePassword", {
      username: row.data.username,
      newPassword: hashed,
    });
    console.log("=======Password updated successfully for user:", row.data.username);
    return reply.code(200).send({ success: true, message: "Password changed successfully" });
  }
  catch (err) {
    reply.code(500);
    return { error: "Failed to change password", details: err.message };
  }
}
// #########################################################
//                Two Factor Controllers()
// #########################################################


export async function twofactor_get(request, reply) {
  //check if 2fa is already enabled for user
  // const username = request.headers['x-user'];
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
  console.log("🔍 User fetched from user-management:", row.data);
  if (!row) {
    return reply.code(400).send({ success: false, message: "User not found" });
  }
  console.log("2FA status:", row.data.two_factor_enabled);
  if (String(row.data.two_factor_enabled) === "true") {
    return reply.code(400).send({ success: false, message: "2FA is already enabled for this user" });
  }
  //generate secret 
  const secret = speakeasy.generateSecret({
    name: `YourApp:${row.data.email}`,
    issuer: "YourApp",
    digits: 6,
    period: 30,
    window: 1
  }); console.log("generated secret:", secret);
  //put it in DB 
  await axios.put("http://user-management:3000/User/two-factor-secret", {
    username,
    two_factor_secret: secret.base32,
  });
  //generate QR code for user to scan 
  const qrImage = await QRCode.toDataURL(secret.otpauth_url);
  //send the QR code to frontend 
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
  console.log("🔍 User fetched from user-management:", row.data);
  if (!row.data) {
    return reply.code(400).send({ success: false, message: "User not found" });
  }
  const secret = row.data.two_factor_secret;
  console.log("Fetched secret from DB:", secret);
  //compare the code with the user input 
  const isValid = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: code,
    window: 1
  });
  if (!isValid) {
    return reply.code(400).send({ success: false, message: "Invalid 2FA code" });
  }
  //if matched check if enabled or not if not enabled enable it

  if (Number(row.data.two_factor_enabled) === 0) {
    console.log(" i am here to enable 2fa ")
    await axios.put("http://user-management:3000/User/enable-two-factor", {
      username,
    });
  }
  return reply.code(200).send({ success: true, message: "2FA verified successfully" });
  //verify the code sent by user with the secret in DB
}
