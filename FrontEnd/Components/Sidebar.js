document.addEventListener("DOMContentLoaded", () => {
    // Get the user role from localStorage
    const userRole = localStorage.getItem("userRole");

    // Hide the "Orders" page link if the role is EMPLOYEE
    if (userRole === "EMPLOYEE") {
        const newOrderBtn = document.getElementById("new-order-button");
        const userMgt = document.getElementById("users-link")
        if (newOrderBtn) {
            newOrderBtn.style.display = "none";  
        }
        if(userMgt){
            userMgt.style.pointerEvents = "none";
        }
    }

    // Add more role-based logic if necessary (like hiding/showing other elements)
});


document.getElementById("logout-btn").addEventListener("click", () => {
    // Clear local storage
    localStorage.clear();
  
    // Redirect to login page
    window.location.href = "/login.html";
  });
  