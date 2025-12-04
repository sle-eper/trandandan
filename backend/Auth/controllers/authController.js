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
      expiresIn: "1min",
    });
    // ✅ Send JWT in cookie
    reply
      .code(200)
      .headers({ "x-user": username })
      .headers({ "x-user-id": id })
      .setCookie("token", token, {
        path: "/",
        httpOnly: true,
      })
      .send({
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
  //$2b$10$36x.AMt4IuAnb7Owt.Uev.g1WXuUJt1GgOtFbspJA4r53ZTDICUBa
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
    { expiresIn: "1h" }
  );
  // ✅ Send JWT in cookie
  reply
    .header("Access-Control-Expose-Headers", "x-user, x-user-id")
    .header("x-user", username)
    .header("x-user-id", row.data.id)
    .setCookie("token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      secure: true
    })
    .code(200)
    .send({ success: true, message: "You are Authourised" });
  return { accessToken: token };
}

// #########################################################
//                     Get Functions
// #########################################################

export async function login_get(request, reply) {
  return reply.sendFile("login.html");
}

export async function signup_get(request, reply) {
  return reply.sendFile("register.html");
}

// #########################################################
//                Verify User Get Function()
// #########################################################

export async function verifyUser_get(request, reply) {
  const token = request.cookies.token;
  if (!token) {
    return reply.code(401).sendFile("login.html");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    reply
      .code(200)
      .headers({ "x-user": decoded.username })
      .headers({ "x-user-id": decoded.id })
      .send({
        authorization: true,
        message: "You are authenticated to access this resource.",
      });
  } catch (err) {
    return reply.code(401).sendFile("login.html");
  }
  return { accessToken: token };
}
