document.addEventListener("DOMContentLoaded", () => {
    const usersTableBody = document.querySelector("#users-table tbody");

    // Fetch users
    async function fetchUsers() {
        try {
            const response = await fetch("http://localhost:8080/api/users");
            const users = await response.json();

            usersTableBody.innerHTML = ""; // Clear table
            users.forEach((user) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                `;
                usersTableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    fetchUsers();

    // Modals
    const changePasswordModal = document.getElementById("change-password-modal");
    const deleteUserModal = document.getElementById("delete-user-modal");
    const createAccountModal = document.getElementById("create-account-modal");

    document.getElementById("change-password-btn").addEventListener("click", () => {
        changePasswordModal.style.display = "flex";
    });

    document.getElementById("delete-user-btn").addEventListener("click", () => {
        deleteUserModal.style.display = "flex";
    });

    document.getElementById("create-account-btn").addEventListener("click", () => {
        createAccountModal.style.display = "flex";
    });

    // Close modals
    document.querySelectorAll(".close-btn").forEach((button) => {
        button.addEventListener("click", () => {
            changePasswordModal.style.display = "none";
            deleteUserModal.style.display = "none";
            createAccountModal.style.display = "none";
        });
    });

    // Handle change password
    document.getElementById("change-password-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("change-username").value;
        const newPassword = document.getElementById("new-password").value;

        try {
            const response = await fetch("http://localhost:8080/api/users/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password: newPassword }),
            });

            if (response.ok) {
                alert("Password updated successfully!");
                changePasswordModal.style.display = "none";
            } else {
                alert("Failed to update password.");
            }
        } catch (error) {
            console.error("Error updating password:", error);
        }
    });

    // Handle delete user
    document.getElementById("delete-user-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("delete-username").value;

        try {
            const response = await fetch(`http://localhost:8080/api/users`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
            });

            if (response.ok) {
                alert("User deleted successfully!");
                deleteUserModal.style.display = "none";
                fetchUsers(); // Refresh users table
            } else {
                alert("Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            console.log(body);
        }
    });

    // Handle create account
    document.getElementById("create-account-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("new-username").value;
        const password = document.getElementById("create-password").value;
        const role = document.getElementById("user-role").value;

        try {
            const response = await fetch("http://localhost:8080/api/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, role }),
            });

            if (response.ok) {
                alert("Account created successfully!");
                createAccountModal.style.display = "none";
                fetchUsers(); // Refresh users table
            } else {
                alert("Failed to create account.");
            }
        } catch (error) {
            console.error("Error creating account:", error);
        }
    });
});
