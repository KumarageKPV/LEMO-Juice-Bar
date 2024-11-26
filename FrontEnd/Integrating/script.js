<<<<<<<< HEAD:FrontEnd/script.js
// Handle login form submission
document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const loginData = {
        username: username,
        password: password
    };

    try {
        const response = await fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const role = await response.text();  // Assuming the response is just the role as a string
            console.log("Login successful, Role:", role);

            // Store the role in localStorage
            localStorage.setItem("userRole", role);

            // Redirect to the dashboard after successful login
            window.location.href = "/Components/Dashboard/Dashboard.html";
        } else {
            const errorMessage = document.getElementById("error-message");
            errorMessage.classList.add("show");
            setTimeout(() => {
                errorMessage.classList.remove("show");
            }, 3000);
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
});
========
// Handle login form submission
document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const loginData = {
        username: username,
        password: password
    };

    try {
        const response = await fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const role = await response.text();  // Assuming the response is just the role as a string
            console.log("Login successful, Role:", role);

            // Store the role in localStorage
            localStorage.setItem("userRole", role);

            // Redirect to the dashboard after successful login
            window.location.href = "/Components/Dashboard/Dashboard.html";
        } else {
            const errorMessage = document.getElementById("error-message");
            errorMessage.classList.add("show");
            setTimeout(() => {
                errorMessage.classList.remove("show");
            }, 3000);
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
});
>>>>>>>> 6611b228d458ba124d4f9634db48bb4871e651a1:FrontEnd/Integrating/script.js
