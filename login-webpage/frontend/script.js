const API_URL = "http://localhost:5500";

document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const logoutBtn = document.getElementById("logout-btn")

    if (loginBtn) loginBtn.addEventListener("click", loginUser);
    if (registerBtn) registerBtn.addEventListener("click", registerUser);
    if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);
    

});


async function registerUser() {
    const email = document.getElementById("reg-email").value;
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;
    const messageElement = document.getElementById("register-message");

    console.log("Register button clicked");

    if (!email || !username || !password) {
        messageElement.innerText = "Please fill in all the fields!";
        messageElement.style.color = "red";
        return;
    }

    try {
        console.log("Sending registration request to backend...");
        const response = await fetch("http://localhost:5500/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password })
        });

    const data = await response.json();
    console.log("Server response:", data);
    messageElement.innerText = data.message;
    messageElement.style.color = data.success ? "green" : "red";

    if (data.success) {
        alert("Registration successful! You can now login.");
        setTimeout(() => {
            console.log("Redirecting to login page...");
            window.location.href = "index.html";
        }, 3000);
    }    

    } catch (error) {
        console.error("Registration error:", error);
        messageElement.innerText = "An error occurred. Please try again!";
        messageElement.style.color = "red";
    }
}


async function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const messageElement = document.getElementById("login-message");

    if (!username || !password) {
        messageElement.innerText = "Please fill in all the fields!";
        messageElement.style.color = "red";
        return;
    }

    try {
        const response = await fetch("http://localhost:5500/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    messageElement.innerText = data.message;
    messageElement.style.color = data.success ? "green" : "red";

    if (data.success) {
        alert("Login successful!");
        localStorage.setItem("loggedInUser", username);
        //setTimeout(() => {
        window.location.href = "dashboard.html"; // Redirect to dashboard
        
    }

    } catch (error) {
        console.error("Login error:", error);
        messageElement.innerText = "An error occurred. Please try again!";
        messageElement.style.color = "red";
    }
        
}


// Function to check if user is logged in
function checkLogin() {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
        alert("You are not logged in. Redirecting to login page.");
        window.location.href = "index.html";
    } else {
        document.getElementById("welcome-message").innerText = `Welcome, ${user}!`;
    }
}

// Function to log out user
function logoutUser() {
    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully!");
    window.location.href = "index.html"; // Redirect to login
}





