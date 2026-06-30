import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "login-webpage/frontend")));

// File to store users
const USERS_FILE = "users.json";

function loadUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) return {};
        const users = fs.readFileSync(USERS_FILE, "utf-8");
        return JSON.parse(users);
    }
    catch (error) {
        console.error("Error loading users:", error);
        return {};
    }
}

function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    }
    catch (error) {
        console.error("Error saving users:", error);
    }
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login-webpage/frontend", "index.html"));
});

//Registering a new user
app.post("/register", (req, res) => {
    const { email, username, password } = req.body;
    const users = loadUsers();
    //let users = getUsers();

    if (!email || !username || !password) {
        return res.status(400).json({ success: false, message: "Please enter all fields!" });
    }

    if (users[username]) {
        return res.status(400).json({ success: false, message: "Username already exists!" });
    }

    //Store the user in the file
    users[username] = {email, password};
    saveUsers(users);

    res.json({ success: true, message: "User registered successfully!" });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    //let users = getUsers();
    const users = loadUsers();

    if (users[username] && users[username].password === password) {
        return res.json({ success: true, message: "Login successful!" });
    } else {
        return res.status(401).json({ success: false, message: "Invalid username or password!" });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
