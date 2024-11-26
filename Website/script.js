document.addEventListener("DOMContentLoaded", fetchOrders);

// Get elements
const viewSupplierBtn = document.getElementById('view-supplier-btn');
const popup = document.getElementById('supplier-popup');
const closePopupBtn = document.getElementById('close-popup');

// Show popup
viewSupplierBtn.addEventListener('click', () => {
  popup.style.display = 'flex';
});

// Close popup
closePopupBtn.addEventListener('click', () => {
  popup.style.display = 'none';
});

// Close popup when clicking outside the content
popup.addEventListener('click', (event) => {
  if (event.target === popup) {
    popup.style.display = 'none';
  }
});

// Handle Update and Delete Actions
document.querySelectorAll('.update-btn').forEach(button => {
    button.addEventListener('click', () => {
      alert('Update Supplier functionality goes here!');
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this supplier?')) {
        alert('Delete Supplier functionality goes here!');
      }
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    // Fetch supplier data when the page loads
    fetchSuppliers();
  
    // Close popup event
    document.getElementById("close-popup").addEventListener("click", () => {
      document.getElementById("supplier-popup").style.display = "none";
    });
  });
  
  async function fetchSuppliers() {
    const apiUrl = 'http://localhost:8080/api/supplier'; // API URL for suppliers

    try {
        const response = await fetch(apiUrl, {
            method: 'GET', // HTTP GET method
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Populate the supplier table with the fetched data
        populateSupplierTable(data);

    } catch (error) {
        console.error('Error fetching supplier data:', error); // Log errors for debugging
    }
}

function populateSupplierTable(suppliers) {
    const tableBody = document.querySelector(".supplier-table tbody");

    // Clear existing rows in the table body
    tableBody.innerHTML = "";

    // Populate table with supplier data
    suppliers.forEach((supplier) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${supplier.name}</td>
            <td>${supplier.email}</td>
            <td>${supplier.phone}</td>
            <td>
                <button class="update-btn" onclick="updateSupplier(${supplier.id})">Update</button>
                <button class="delete-btn" onclick="deleteSupplier(${supplier.id})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}
function deleteSupplier(supplierId) {
    // Show confirmation alert
    const confirmation = confirm("Are you sure you want to delete this supplier?");
    
    if (confirmation) {
        // Send DELETE request to the API
        fetch(`http://localhost:8080/api/supplier/`, {
            method: "DELETE",
            headers: {
                'Content '
            }
        })
        .then((response) => {
            if (response.ok) {
               // alert("Supplier deleted successfully.");
                // Reload the supplier table after deletion
                fetchSuppliers(); // Replace this with your logic to refresh the table
            } else {
                return response.json().then((data) => {
                    alert(`Failed to delete supplier: ${data.message || "Unknown error"}`);
                });
            }
        })
        .catch((error) => {
            console.error("Error deleting supplier:", error);
            alert("An error occurred while trying to delete the supplier.");
        });
    }
}
async function fetchOrders() {
    const apiUrl = 'http://localhost:8080/api/orders'; // API URL for orders

    try {
        const response = await fetch(apiUrl, {
            method: 'GET', // Specify the GET method
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response

        // Populate the order table with the fetched data
        populateOrderTable(data);

    } catch (error) {
        console.error('Error fetching order data:', error); // Log errors for debugging
    }
}

function populateOrderTable(orders) {
    const tableBody = document.querySelector("table tbody");

    // Clear existing rows in the table body
    tableBody.innerHTML = "";

    // Populate table with order data
    orders.forEach((order) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.quantity}</td>
            <td>${order.supplier.id}</td>
            <td>${order.orderDate || "Not Available"}</td>
            <td>${order.productName } </td>
            <td class="status ${order.status.toLowerCase()}">${order.status}</td>
            <td>
              <button class="update-btn">Update</button>
              <button class="delete-btn">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

