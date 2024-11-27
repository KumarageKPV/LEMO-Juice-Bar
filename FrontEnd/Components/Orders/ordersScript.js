document.addEventListener("DOMContentLoaded", fetchOrders);
document.getElementById("new-order-button").addEventListener("click", () => {
  // Show the modal when the button is clicked
  showOrderModal();
});

// Get elements
const viewSupplierBtn = document.getElementById("view-supplier-btn");
const popup = document.getElementById("supplier-popup");
const closePopupBtn = document.getElementById("close-popup");

// Show popup
viewSupplierBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

// Close popup
closePopupBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

// Close popup when clicking outside the content
popup.addEventListener("click", (event) => {
  if (event.target === popup) {
    popup.style.display = "none";
  }
});

// Handle Update and Delete Actions
document.querySelectorAll(".update-btn").forEach((button) => {
  button.addEventListener("click", () => {
    alert("Update Supplier functionality goes here!");
  });
});

document.querySelectorAll(".delete-btn").forEach((button) => {
  button.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      alert("Delete Supplier functionality goes here!");
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
  const apiUrl = "http://localhost:8080/api/supplier"; // API URL for suppliers

  try {
    const response = await fetch(apiUrl, {
      method: "GET", // HTTP GET method
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Populate the supplier table with the fetched data
    populateSupplierTable(data);
  } catch (error) {
    console.error("Error fetching supplier data:", error); // Log errors for debugging
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
            <td>${supplier.id}</td>
            <td>${supplier.name}</td>
            <td>${supplier.email}</td>
            <td>${supplier.phone}</td>
            <td>
                <button class="update-btn" onclick="updateSupplier('${supplier.id}')">Update</button>
                <button class="delete-btn" onclick="deleteSupplier('${supplier.name}')">Delete</button>
            </td>
        `;

    tableBody.appendChild(row);
  });
}
function deleteSupplier(supplierName) {
  // Show confirmation alert
  console.log(supplierName); // Debugging
  const confirmation = confirm(
    "Are you sure you want to delete this supplier?"
  );

  if (confirmation) {
    // Send DELETE request to the API
    fetch(`http://localhost:8080/api/supplier`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: supplierName }), // Fixed typo
    })
      .then((response) => {
        if (response.ok) {
          alert("Supplier deleted successfully.");
          // Reload the supplier table after deletion
          fetchSuppliers(); // Replace this with your logic to refresh the table
        } else {
          return response.json().then((data) => {
            alert(
              `Failed to delete supplier: ${data.message || "Unknown error"}`
            );
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting supplier:", error);
        alert("An error occurred while trying to delete the supplier.");
      });
  }
}

function updateSupplier(supplierId) {}

async function fetchOrders() {
  const apiUrl = "http://localhost:8080/api/orders"; // API URL for orders

  try {
    const response = await fetch(apiUrl, {
      method: "GET", // Specify the GET method
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Parse JSON response

    // Populate the order table with the fetched data
    populateOrderTable(data);
  } catch (error) {
    console.error("Error fetching order data:", error); // Log errors for debugging
  }
}

function populateOrderTable(orders) {
  const tableBody = document.querySelector("table tbody");

  // Clear existing rows in the table body
  tableBody.innerHTML = "";

  // Populate table with order data
  orders.forEach((order) => {
    const row = document.createElement("tr");

    // Determine the color for the status
    let statusClass = "";
    if (order.status === "PENDING") {
      statusClass = "yellow";
    } else if (order.status === "RECEIVED") {
      statusClass = "green";
    }

    // Add the Received and Cancelled buttons only if the status is PENDING
    const actionButtons =
      order.status === "PENDING"
        ? `
            <button class="update-btn" onclick="markReceived('${order.id}')">Received</button>
            <button class="delete-btn" onclick="markCancelled('${order.id}')">Cancelled</button>
        `
        : "";

    row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.quantity}</td>
            <td>${order.supplier.name}</td>
            <td>${order.orderDate || "Not Available"}</td>
            <td>${order.productName}</td>
            <td class="status ${statusClass}">${order.status}</td>
            <td>${actionButtons}</td>
        `;

    tableBody.appendChild(row);
  });
}

function markReceived(orderId) {
  // Show confirmation popup
  const confirmation = confirm(
    "Are you sure you want to mark this order as 'Received'?"
  );

  if (confirmation) {
    // Make the API call
    fetch(
      `http://localhost:8080/api/orders/${orderId}/status?status=RECEIVED`,
      {
        method: "PUT",
      }
    )
      .then((response) => {
        if (response.ok) {
          alert("Order marked as 'Received' successfully.");
          // Reload or update the orders table as needed
          fetchOrders(); // Replace with your logic to refresh the orders list
        } else {
          return response.json().then((data) => {
            alert(
              `Failed to update order status: ${
                data.message || "Unknown error"
              }`
            );
          });
        }
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
        alert("An error occurred while updating the order status.");
      });
  }
}

function markCancelled(orderId) {
  // Show confirmation popup
  const confirmation = confirm(
    "Are you sure you want to mark this order as 'Canelled'?"
  );

  if (confirmation) {
    // Make the API call
    fetch(
      `http://localhost:8080/api/orders/${orderId}/status?status=CANCELLED`,
      {
        method: "PUT",
      }
    )
      .then((response) => {
        if (response.ok) {
          alert("Order marked as 'Cancelled' successfully.");
          // Reload or update the orders table as needed
          fetchOrders(); // Replace with your logic to refresh the orders list
        } else {
          return response.json().then((data) => {
            alert(
              `Failed to update order status: ${
                data.message || "Unknown error"
              }`
            );
          });
        }
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
        alert("An error occurred while updating the order status.");
      });
  }
}

function updateSupplier(supplierId) {
  // Create a modal container
  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
        <div class="modal-content">
            <h2>Update Supplier</h2>
            <form id="update-supplier-form">
                <label for="supplier-name">Name:</label>
                <input type="text" id="supplier-name" placeholder="Enter name" required>

                <label for="supplier-email">Email:</label>
                <input type="email" id="supplier-email" placeholder="Enter email" required>

                <label for="supplier-phone">Phone:</label>
                <input type="text" id="supplier-phone" placeholder="Enter phone number" required>

                <div class="modal-actions">
                    <button type="button" id="cancel-button">Cancel</button>
                    <button type="submit" id="update-button">Update</button>
                </div>
            </form>
        </div>
    `;

  // Append the modal to the body
  document.body.appendChild(modal);

  // Styling for the modal
  const style = document.createElement("style");
  style.innerHTML = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .modal-content {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        .modal-content h2 {
            margin-bottom: 15px;
        }
        .modal-content form label {
            display: block;
            margin: 10px 0 5px;
        }
        .modal-content form input {
            width: calc(100% - 10px);
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .modal-actions {
            display: flex;
            justify-content: space-between;
        }
        .modal-actions button {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #cancel-button {
            background: #f44336;
            color: white;
        }
        #update-button {
            background: #4CAF50;
            color: white;
        }
        #cancel-button:hover {
            background: #d32f2f;
        }
        #update-button:hover {
            background: #388E3C;
        }
    `;
  document.head.appendChild(style);

  // Add event listeners
  const cancelButton = modal.querySelector("#cancel-button");
  const updateForm = modal.querySelector("#update-supplier-form");

  cancelButton.addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  updateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get input values
    const name = modal.querySelector("#supplier-name").value;
    const email = modal.querySelector("#supplier-email").value;
    const phone = modal.querySelector("#supplier-phone").value;

    // Make API call to update supplier
    fetch(`http://localhost:8080/api/supplier/${supplierId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Supplier updated successfully.");
          document.body.removeChild(modal); // Close modal
          fetchSuppliers(); // Reload suppliers table
        } else {
          return response.json().then((data) => {
            alert(
              `Failed to update supplier: ${data.message || "Unknown error"}`
            );
          });
        }
      })
      .catch((error) => {
        console.error("Error updating supplier:", error);
        alert("An error occurred while updating the supplier.");
      });
  });
}

function showOrderModal() {
  // Create and style the modal
  const modal = document.getElementById("order-modal");
  modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <h2>Add New Order</h2>
                <form id="order-form">
                    <label for="supplier-id">Supplier ID:</label>
                    <input type="number" id="supplier-id" required />
                    
                    <label for="product-name">Product Name:</label>
                    <input type="text" id="product-name" required />
                    
                    <label for="quantity">Quantity:</label>
                    <input type="number" id="quantity" required />
                    
                    <label for="order-date">Order Date:</label>
                    <input type="date" id="order-date" required />
                    
                    <div class="modal-buttons">
                        <button type="button" id="cancel-button" onclick="closeModal()">Close</button>
                        <button type="submit" id="save-button">Add Order</button>
                    </div>
                </form>
            </div>
        </div>
    `;
  modal.classList.remove("hidden");

  // Add styling for the modal
  const style = document.createElement("style");
  style.innerHTML = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            width: 400px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .modal-content h2 {
            margin: 0 0 15px;
        }

        .modal-content form label {
            display: block;
            margin: 10px 0 5px;
        }

        .modal-content form input {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        .modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .modal-buttons button {
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .modal-buttons #cancel-button {
            background-color: #ccc;
        }

        .modal-buttons #save-button {
            background-color: #007bff;
            color: white;
        }
    `;
  document.head.appendChild(style);

  // Add event listeners for cancel and save buttons
  document.getElementById("cancel-button").addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  document.getElementById("order-form").addEventListener("submit", (event) => {
    event.preventDefault();
    submitOrder();
    modal.classList.add("hidden");
  });
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById("order-modal");
    modal.classList.add("hidden");  // Add the 'hidden' class to hide the modal
}


function submitOrder() {
  const supplierId = document.getElementById("supplier-id").value;
  const productName = document.getElementById("product-name").value;
  const quantity = document.getElementById("quantity").value;
  const orderDate = document.getElementById("order-date").value;

  // Create the order object
  const order = {
    supplier: {
      id: parseInt(supplierId),
    },
    productName: productName,
    quantity: parseInt(quantity),
    orderDate: orderDate,
  };

  // Call the API
  fetch("http://localhost:8080/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  })
    .then((response) => {
      if (response.ok) {
        alert("Order added successfully!");
        // Reload or refresh orders table
        fetchOrders();
      } else {
        return response.json().then((data) => {
          alert(`Failed to add order: ${data.message || "Unknown error"}`);
        });
      }
    })
    .catch((error) => {
      console.error("Error adding order:", error);
      alert("An error occurred while adding the order.");
    });
}

// Open modal
function openAddSupplierModal() {
    const modal = document.getElementById("supplier-modal");
    const overlay = document.getElementById("modal-overlay");

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
}

// Close modal
function closeAddSupplierModal() {
    const modal = document.getElementById("supplier-modal");
    const overlay = document.getElementById("modal-overlay");

    modal.classList.add("hidden");
    overlay.classList.add("hidden");
}

// Submit supplier form
document.getElementById("supplier-form").addEventListener("submit", (event) => {
    event.preventDefault();

    // Get input values
    const name = document.getElementById("supplier-name").value;
    const email = document.getElementById("supplier-email").value;
    const phone = document.getElementById("supplier-phone").value;

    // API call to add supplier
    fetch("http://localhost:8080/api/supplier", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
        }),
    })
        .then((response) => {
            if (response.ok) {
                alert("Supplier added successfully!");
                closeAddSupplierModal(); // Close modal on success
                // Optional: refresh supplier table
                fetchSuppliers();
            } else {
                alert("Failed to add supplier.");
            }
        })
        .catch((error) => {
            console.error("Error adding supplier:", error);
            alert("An error occurred while adding the supplier.");
        });
});
