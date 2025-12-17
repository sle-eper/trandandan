import bcrypt from "bcrypt";
import { validatePassword } from "../Password.js";
import jwt from "jsonwebtoken";
import axios from "axios";

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
    reply
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
    reply.code(500).send({ success: false, message: "Internal server error" });
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
  console.log("🔍 Comparing passwords");
  console.log(row.data.password_hash);
  console.log(password);
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
//                Verify User Get Function()
// #########################################################

export async function verifyUser_get(request, reply) {
  const token = request.cookies.token;
  const origin = request.headers.origin;
  if (origin != "http://localhost:5173")
  {
    return reply.code(403).send("Forbidden");
  }
  if (!token) {
    return reply.code(401).send("Not Authorized")
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    reply
      .code(200)
      .send({
        authorization: true,
        message: "You are authenticated to access this resource.",
        id: decoded.id,
        username: decoded.username
      });
  } catch (err) {
    return reply.code(401).send("Not authorized");
  }
  return { accessToken: token };
}

