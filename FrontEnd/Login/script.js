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

        // Check for successful login
        if (response.ok) {
            const data = await response.text();
            console.log("Login successful:", data);
            // You can perform further actions like redirecting to a dashboard here
        } else {
            // Handle invalid credentials
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
