document.addEventListener("DOMContentLoaded", () => {
    // Get the user role from localStorage
    const userRole = localStorage.getItem("userRole");

    if (userRole === "EMPLOYEE") {
        const newOrderBtn = document.getElementById("new-order-button");
        const userMgt = document.getElementById("users-link")
        const orderMgt = document.getElementById("orders-link")
        const reportMgt = document.getElementById("report-link")
        if (newOrderBtn) {
            newOrderBtn.style.display = "none";  
        }
        if(userMgt){
            userMgt.style.pointerEvents = "none";
        }
        if(orderMgt){
            orderMgt.style.pointerEvents = "none";
        }
        if(reportMgt){
            reportMgt.style.pointerEvents = "none";
        }
    }

});


document.getElementById("logout-btn").addEventListener("click", () => {
    // Clear local storage
    localStorage.clear();
  
    // Redirect to login page
    window.location.href = "/login.html";
  });
  