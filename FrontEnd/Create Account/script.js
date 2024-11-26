// Handle create account form submission
document.getElementById("create-account-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const accountData = {
        username: username,
        password: password,
        role: role
    };

    try {
        const response = await fetch("http://localhost:8080/api/users/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(accountData)
        });

        const responseText = await response.text();

        // Handle success or failure based on the response
        if (response.ok) {
            const successMessage = document.getElementById("success-message");
            successMessage.classList.add("show");
            setTimeout(() => {
                successMessage.classList.remove("show");
            }, 3000);
        } else {
            const errorMessage = document.getElementById("error-message");
            errorMessage.classList.add("show");
            setTimeout(() => {
                errorMessage.classList.remove("show");
            }, 3000);
        }
        console.log(responseText); // Print response to the console
    } catch (error) {
        console.error("Error during account creation:", error);
        const errorMessage = document.getElementById("error-message");
        errorMessage.classList.add("show");
        setTimeout(() => {
            errorMessage.classList.remove("show");
        }, 3000);
    }
});
