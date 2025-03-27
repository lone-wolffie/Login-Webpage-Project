require("dotenv").config();

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

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
app.listen(PORT, () => console.log("Server running on port 5500"));
