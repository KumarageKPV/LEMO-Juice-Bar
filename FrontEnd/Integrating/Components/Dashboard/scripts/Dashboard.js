async function fetchProductData() {
    const apiUrl = 'http://localhost:8080/api/inventory'; // Replace with your API URL

    try {
        const response = await fetch(apiUrl, {
            method: 'GET', // Specify the GET method
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Product Data:', data); // Log the data to the console

        // Populate the product table with the fetched data
        populateProductTable(data);

    } catch (error) {
        console.error('Error fetching product data:', error); // Log errors to the console
    }
}

// Function to populate the product table
function populateProductTable(data) {
    const tbody = document.querySelector("#product-table tbody"); // Select the table body

    // Clear existing rows in the table
    tbody.innerHTML = "";

    // Initialize counters for Low Stock and Out of Stock
    let lowStockCount = 0;
    let outOfStockCount = 0;

    data.forEach(item => {
        // Create a new table row
        const tr = document.createElement("tr");

        // Create and append table data (columns)
        const productNameTd = document.createElement("td");
        productNameTd.textContent = item.fruitName; // Assuming `fruitName` is part of the API response
        productNameTd.className = "product-name";
        tr.appendChild(productNameTd);

        const categoryTd = document.createElement("td");
        categoryTd.textContent = item.category; // Hardcoded or determine dynamically if provided
        tr.appendChild(categoryTd);

        const quantityTd = document.createElement("td");
        quantityTd.textContent = item.quantity.toFixed(2); // Assuming `quantity` is part of the API response
        tr.appendChild(quantityTd);

        // Check if the quantity is low or out of stock
        if (item.quantity === 0) {
            outOfStockCount++;
        } else if (item.quantity < 5) {
            lowStockCount++;
        }

        const actionsTd = document.createElement("td");
        // const editButton = document.createElement("button");
        // editButton.className = "edit-btn";
        // editButton.innerHTML = '<i class="fa fa-pencil"></i>'; // Edit icon
        // // Add edit functionality if needed
        // actionsTd.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "🗑"; // Trash icon
        // Add delete functionality if needed
        actionsTd.appendChild(deleteButton);

        tr.appendChild(actionsTd);

        // Append the row to the table body
        tbody.appendChild(tr);
    });

    // Update the "Low Stock" and "Out of Stock" counts dynamically
    document.querySelector(".stat-box:nth-child(1) h3").textContent = lowStockCount;
    document.querySelector(".stat-box:nth-child(2) h3").textContent = outOfStockCount;
}


document.addEventListener('DOMContentLoaded', () => {
    const deleteModal = document.getElementById('delete-item-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    let currentFruitToDelete = null; // Store the fruit name to delete

    // Handle delete button clicks
    document.querySelector("#product-table").addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            // Get the corresponding row and fruit name
            const row = e.target.closest('tr');
            const fruitName = row.querySelector('.product-name').textContent;

            currentFruitToDelete = fruitName; // Store fruit name to delete
            deleteModal.style.display = 'flex'; // Show the modal
        }
    });

    // Confirm delete action
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!currentFruitToDelete) return;

        const payload = {
            fruitName: currentFruitToDelete,
        };

        try {
            const response = await fetch('http://localhost:8080/api/inventory/delete', {
                method: 'DELETE', // Use DELETE method instead of POST
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // Reload the table data after deletion
                showSuccessMessage('Item deleted successfully!');
                deleteModal.style.display = 'none';
                currentFruitToDelete = null;
                fetchProductData(); // Function to reload the product table
            } else {
                throw new Error(`Failed to delete item. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    });

    // Cancel delete action
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none'; // Hide the modal
        currentFruitToDelete = null; // Reset the fruit name
    });

    // Success message function
    function showSuccessMessage(message) {
        const successMessage = document.createElement('div');
        successMessage.textContent = message;
        successMessage.style.position = 'fixed';
        successMessage.style.top = '20px';
        successMessage.style.left = '50%';
        successMessage.style.transform = 'translateX(-50%)';
        successMessage.style.backgroundColor = '#4CAF50';
        successMessage.style.color = 'white';
        successMessage.style.padding = '10px 20px';
        successMessage.style.borderRadius = '5px';
        successMessage.style.zIndex = '1000';

        document.body.appendChild(successMessage);

        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 1500);
    }

    // Fetch product data and populate the table (example implementation)
    async function fetchProductData() {
        try {
            const response = await fetch('http://localhost:8080/api/inventory'); // Adjust API endpoint as necessary
            const data = await response.json();
            populateProductTable(data); // Use your provided function
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    }

    // Initial table load
    fetchProductData();
});


// Call the fetchProductData function when the page loads
document.addEventListener('DOMContentLoaded', fetchProductData);

document.addEventListener('DOMContentLoaded', () => {
    const addItemBtn = document.getElementById('add-item-btn'); // Image button
    const addItemModal = document.getElementById('add-item-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const addItemForm = document.getElementById('add-item-form');

    // Show modal when "Add Item" image is clicked
    addItemBtn.addEventListener('click', () => {
        addItemModal.style.display = 'flex';
    });

    // Hide modal when "Close" button is clicked
    closeModalBtn.addEventListener('click', () => {
        addItemModal.style.display = 'none';
    });

    // Handle form submission
    addItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productName = document.getElementById('product-name').value;
        const productCategory = document.getElementById('product-category').value;
        const productQuantity = document.getElementById('product-quantity').value;

        const newProduct = {
            fruitName: productName,
            quantity: parseFloat(productQuantity), // Convert quantity to a number
            category: productCategory
        };

        try {
            const response = await fetch('http://localhost:8080/api/inventory/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Show success message
            showSuccessMessage('Item added successfully!');

            // Close the modal after a short delay
            setTimeout(() => {
                addItemModal.style.display = 'none';

                // Optionally, refresh the product table
                fetchProductData();

                // Reset the form
                addItemForm.reset();
            }, 1500);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === addItemModal) {
            addItemModal.style.display = 'none';
        }
    });

    // Function to show success message
    function showSuccessMessage(message) {
        const successMessage = document.createElement('div');
        successMessage.textContent = message;
        successMessage.style.position = 'fixed';
        successMessage.style.top = '20px';
        successMessage.style.left = '50%';
        successMessage.style.transform = 'translateX(-50%)';
        successMessage.style.backgroundColor = '#4CAF50';
        successMessage.style.color = 'white';
        successMessage.style.padding = '10px 20px';
        successMessage.style.borderRadius = '5px';
        successMessage.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        successMessage.style.zIndex = '1000';

        document.body.appendChild(successMessage);

        // Remove the message after 1.5 seconds
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 1500);
    }
});
