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
            showErrorModal();
            console.log("Login failed");
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
function showErrorModal() {
    // Create the modal container
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // Increase opacity for a dimmer effect
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";

    // Create the modal content
    const modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "#fff";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "8px";
    modalContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    modalContent.style.textAlign = "center";
    modalContent.style.color = "red"; // Set the text color to red
    modalContent.textContent = "Invalid credentials, Please try again";

    // Append the modal content to the modal container
    modal.appendChild(modalContent);

    // Append the modal to the document body
    document.body.appendChild(modal);

    // Remove the modal after 3 seconds
    setTimeout(() => {
        modal.remove();
    }, 2000);
}

