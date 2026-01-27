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
      .code(200)
      .send({
        success: true,
        message: "Registration successful",
      });
  } catch (err) {
    console.error("Error during registration:", err);
    return reply
      .code(500)
      .send({ success: false, message: "Internal server error" });
  }
  // return { accessToken: token };
}

// #########################################################
//                     login post
// #########################################################
export async function login_post(request, reply) {
  const { username, password } = request.body;
  const authHeader = request.headers["authorization"];
  const row = await axios.get("http://user-management:3000/profile/User", {
    params: {
      username,
    },
  });
  if (!row) {
    return reply.code(400).send({ success: false, message: "User not found" });
  }
  if (Number(row.data.two_factor_enabled) === 1) {
    return reply.code(206).send({ username: row.data.username, success: true, message: "2FA required" });
  }

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
  return reply
    .setCookie("token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .header('x-user', row.data.username)
    .header('x-user-id', row.data.id)
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
    .code(200)
    .send({ success: true, message: "You are logged out" });
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
      .header("x-user", decoded.username)
      .header("x-user-id", decoded.id)
      .send({
        authorization: true,
        message: "You are authenticated to access this resource.",
        id: decoded.id,
        username: decoded.username,
      });
  } catch (err) {
    return reply.code(401).send({ error: "Not authorized" });
  }
}

// #########################################################
//                Forget Password Controllers()
// #########################################################

export async function forgetPassword_post(request, reply) {
  const { email } = request.body;
  //check if email exists in DB 
  try {
    const row = await axios.get("http://user-management:3000/profile/User", {
      params: {
        email,
      },
    });
    if (!row.data) {
      return reply
        .code(400)
        .send({ success: false, message: "User not found" });
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
    const resetUrl = `https://localhost:8443/change?token=${token}`;
    let mailOptions = {
      from: '"My App" <soumayaaitammi2023@gmail.com>',
      to: email,
      subject: "Reset Your Password",
      text: `🔑 Need a new password? Reset it here: ${resetUrl}`,
      html: `<p>🔑 Need a new password? Just click <a href="${resetUrl}">here</a> to reset it.</p>`

    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error:", error);
      }
    });
    return reply
      .code(200)
      .send({ success: true, message: "Reset link sent to email" });
  } catch (err) {
    reply.code(500);
    return { error: "Failed to send email", details: err.message };
  }
  //send mail with reset link
}

export async function resetPassword_post(request, reply) {
  const { token, newPassword, confirmPassword } = request.body;
  if (newPassword !== confirmPassword) {
    return reply
      .code(400)
      .send({ success: false, message: "Passwords do not match." });
  }
  try {
    const row = await axios.get("http://user-management:3000/profile/User", {
      params: {
        token,
      },
    });
    if (!row.data) {
      return reply.code(400).send({ success: false, message: "Invalid or expired token" });
    }
    const { valid, errors } = validatePassword(newPassword, { minLen: 8 });
    if (!valid) {
      return reply
        .code(400)
        .send({ success: false, message: "Weak password.", errors });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await axios.put("http://user-management:3000/User/changePassword", {
      username: row.data.username,
      newPassword: hashed,
    });
    return reply.code(200).send({ success: true, message: "Password changed successfully" });
  }
  catch (err) {
    reply.code(500);
    return { error: "Failed to change password", details: err.message };
  }
}
