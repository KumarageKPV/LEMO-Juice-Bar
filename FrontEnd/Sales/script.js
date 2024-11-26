let saleToDelete = null; // Store the sale ID to delete
let saleItems = []; // Store sale items before submitting the form

// Fetch and populate sales data
const fetchSales = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/sales");
    const sales = await response.json();

    const tableBody = document.querySelector("#sales-table tbody");
    tableBody.innerHTML = ""; // Clear table before populating

    sales.forEach((sale) => {
      const items = sale.saleItems
        .map((item) => `${item.juice.name} (x${item.quantity})`)
        .join("<br>");

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${sale.id}</td>
        <td>${sale.sale_date}</td>
        <td>${sale.payment_method}</td>
        <td>${sale.price}</td>
        <td>${items || "No Items"}</td>
        <td>
          <button class="delete-btn" onclick="showDeleteModal(${sale.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching sales:", error);
  }
};

// Show Add Sale Modal
const showAddSaleModal = () => {
  const modal = document.getElementById("add-sale-modal");
  modal.classList.remove("hidden");

  // Clear previous items when modal is opened
  const saleItemsContainer = document.getElementById("sale-items");
  saleItemsContainer.innerHTML = ""; // Clear previous sale items
  addNewItemField(); // Add the first item field when opening the modal
};

// Close Add Sale Modal
const closeAddSaleModal = () => {
  const modal = document.getElementById("add-sale-modal");
  modal.classList.add("hidden");
};

// Handle Add Sale Form Submit
// Handle Add Sale Form Submit
const handleAddSaleSubmit = async (event) => {
  event.preventDefault();

  const saleDate = document.getElementById("sale-date").value;
  const paymentMethod = document.getElementById("payment-method").value;
  const price = parseFloat(document.getElementById("price").value);
  const saleItems = Array.from(document.querySelectorAll(".sale-item")).map(item => ({
    juice: { name: item.querySelector("input[name='juice-name']").value },
    quantity: parseInt(item.querySelector("input[name='quantity']").value, 10)
  }));

  const saleData = {
    sale_date: saleDate,
    payment_method: paymentMethod,
    price: price,
    saleItems: saleItems
  };

  try {
    const response = await fetch("http://localhost:8080/api/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(saleData)
    });

    if (!response.ok) {
      closeAddSaleModal();
      const errorMessage = await response.json(); // Assuming the error message is in JSON format
      if (response.status === 400 && errorMessage.message.includes("juice")) {
        showErrorMessage("There is no juice named \"" + errorMessage.message.split(" ")[3] + "\" to reduce from inventory.");
      } else {
        showErrorMessage("Failed to add sale. Please make sure enough quantity avaialble in inventory and try again.");
      }
      return;
    }

    showSuccessMessage("Sale added successfully.");
    closeAddSaleModal();
    fetchSales(); // Refresh sales table
  } catch (error) {
    console.error("Error adding sale:", error);
    showErrorMessage("Failed to add sale , Please ensure the juice is available in inventory.");
  }
};

// Show error message
// Show error message
const showErrorMessage = (message) => {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  errorMessage.classList.add("error"); // Optional: Add a class for error-specific styling
  setTimeout(() => {
    errorMessage.classList.add("hidden");
  }, 3000);
};



// Show success message
const showSuccessMessage = (message) => {
  const successMessage = document.getElementById("success-message");
  successMessage.textContent = message;
  successMessage.classList.remove("hidden");
  setTimeout(() => {
    successMessage.classList.add("hidden");
  }, 3000);
};

// Show delete confirmation modal
const showDeleteModal = (saleId) => {
  saleToDelete = saleId;
  const modal = document.getElementById("delete-modal");
  modal.classList.remove("hidden");
};

// Close delete modal
const closeDeleteModal = () => {
  saleToDelete = null;
  const modal = document.getElementById("delete-modal");
  modal.classList.add("hidden");
};

// Confirm and delete sale
const confirmDelete = async () => {
  if (saleToDelete !== null) {
    try {
      const response = await fetch(`http://localhost:8080/api/sales/${saleToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete sale.");
      }

      showSuccessMessage("Sale deleted successfully.");
      closeDeleteModal();
      fetchSales(); // Refresh sales table
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  }
};

// Add a new item input field
const addNewItemField = () => {
  const saleItemsContainer = document.getElementById("sale-items");

  const newItemDiv = document.createElement("div");
  newItemDiv.classList.add("sale-item");

  newItemDiv.innerHTML = `
    <input type="text" name="juice-name" placeholder="Juice Name" required>
    <input type="number" name="quantity" placeholder="Quantity" required>
    <button type="button" class="remove-item-btn" onclick="removeItemField(this)">Remove</button>
  `;
  
  saleItemsContainer.appendChild(newItemDiv);
};

// Remove an item input field
const removeItemField = (button) => {
  const itemDiv = button.closest(".sale-item");
  itemDiv.remove();
};

// Add event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("add-new-sale-btn").addEventListener("click", showAddSaleModal);
  document.getElementById("cancel-add-btn").addEventListener("click", closeAddSaleModal);
  document.getElementById("add-sale-form").addEventListener("submit", handleAddSaleSubmit);
  document.getElementById("cancel-delete-btn").addEventListener("click", closeDeleteModal);
  document.getElementById("confirm-delete-btn").addEventListener("click", confirmDelete);
  
  document.getElementById("add-item-btn").addEventListener("click", addNewItemField); // Add item on button click
  
  fetchSales(); // Fetch sales on page load
});
