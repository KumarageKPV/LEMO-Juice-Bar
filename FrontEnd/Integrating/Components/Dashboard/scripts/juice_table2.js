async function fetchJuiceData() {
    const apiUrl = 'http://localhost:8080/api/juice'; // Replace with your API URL

    try {
        const response = await fetch(apiUrl, {
            method: 'GET', // Specify the GET method
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Juice Data:', data); // Log the data to the console

        // Populate the juice table with the fetched data
        populateJuiceTable(data);

    } catch (error) {
        console.error('Error fetching juice data:', error); // Log errors to the console
    }
}
function populateJuiceTable(data) {
    const tbody = document.querySelector("#juice-table tbody"); // Select the table body

    // Clear existing rows in the table
    tbody.innerHTML = "";

    // Loop through each juice item in the data
    data.forEach(item => {
        // Create a new table row
        const tr = document.createElement("tr");

        // Create and append table data (columns)
        const juiceNameTd = document.createElement("td");
        juiceNameTd.textContent = item.name; // Assuming `name` is part of the API response
        juiceNameTd.className = "juice-name";
        tr.appendChild(juiceNameTd);

        const priceTd = document.createElement("td");
        priceTd.textContent = item.price.toFixed(2); // Assuming `price` is part of the API response
        tr.appendChild(priceTd);

        const actionsTd = document.createElement("td");

        // Create the edit button and set the juice ID as a data attribute
        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.innerHTML = '<i class="fa fa-pencil"></i>'; // Edit icon

        // Set the data attribute for the edit button
        editButton.dataset.juiceId = item.id; // Assuming `id` is part of the API response

        // Add edit button functionality
        editButton.addEventListener("click", () => {
            // Retrieve the juiceId from the button's data attribute
            const juiceId = editButton.dataset.juiceId;
            openEditJuiceModal(item, juiceId); // Pass the juice object and juiceId to the modal
        });

        // Create the delete button and set the juice ID as a data attribute
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "🗑"; // Trash icon

        // Set the data attribute for the delete button
        deleteButton.dataset.juiceId = item.id; // Assuming `id` is part of the API response

        // Add delete functionality
        deleteButton.addEventListener("click", () => {
            const juiceId = deleteButton.dataset.juiceId;
            openDeleteJuiceModal(juiceId);
        });

        // actionsTd.appendChild(editButton);
        actionsTd.appendChild(deleteButton);

        tr.appendChild(actionsTd);

        // Append the row to the table body
        tbody.appendChild(tr);
    });
}

let fruitUsageCount = 1;  // Start with one fruit usage field

function openEditJuiceModal(juice, juiceId) {
    const modal = document.getElementById("edit-juice-modal");
    const editJuiceName = document.getElementById("edit-juice-name");
    const editJuicePrice = document.getElementById("edit-juice-price");
    const fruitUsagesContainer = document.getElementById("fruit-usages-container");

    // Store the juiceId in the modal's data attribute
    modal.dataset.juiceId = juiceId;

    // Populate the modal with the existing juice information
    editJuiceName.value = juice.name;
    editJuicePrice.value = juice.price;

    // Clear previous fruit usage fields
    fruitUsagesContainer.innerHTML = '';
    
    // Loop through the fruit usages and add fields dynamically
    juice.fruitUsages.forEach((usage, index) => {
        addFruitUsageField(usage.fruitName, usage.quantityRequired, index + 1);
    });

    modal.style.display = "block"; // Show the modal
}

document.getElementById("edit-item-form").onsubmit = function (event) {
    event.preventDefault(); // Prevent form submission

    // Collect the fruit usage data
    const fruitUsages = [];
    const fruitUsageDivs = document.querySelectorAll(".fruit-usage");

    fruitUsageDivs.forEach((div) => {
        const fruitName = div.querySelector(".fruit-name").value;
        const quantityRequired = parseFloat(div.querySelector(".quantity-required").value);

        if (fruitName && !isNaN(quantityRequired)) {
            fruitUsages.push({ fruitName, quantityRequired });
        }
    });

    // Get the juice ID (You should pass the juice ID when opening the modal)
    const juiceId = document.getElementById("edit-juice-modal").dataset.juiceId;

    // Get the new price from the form
    const price = parseFloat(document.getElementById("edit-juice-price").value);

    // Send the PUT request to update the juice (send only fruitUsages in the body)
    fetch(`http://localhost:8080/api/juice/${juiceId}?newPrice=${price}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: null, // Send the updated fruit usage data only
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message
            showSuccessMessage("Juice details updated successfully!");
            // Close the modal
            document.getElementById("edit-juice-modal").style.display = "none";
        } else {
            alert("Failed to update juice details.");
            console.log(fruitUsages);
        }
    })
    .catch(error => console.error('Error updating juice:', error));
};




function addFruitUsageField(fruitName = "", quantityRequired = 0, index) {
    const fruitUsagesContainer = document.getElementById("fruit-usages-container");

    // Create a new fruit usage field
    const fruitUsageDiv = document.createElement("div");
    fruitUsageDiv.className = "fruit-usage";
    fruitUsageDiv.id = `fruit-usage-${index}`;

    // Fruit Name input
    const fruitNameInput = document.createElement("input");
    fruitNameInput.type = "text";
    fruitNameInput.className = "fruit-name";
    fruitNameInput.placeholder = "Fruit Name";
    fruitNameInput.value = fruitName;
    fruitUsageDiv.appendChild(fruitNameInput);

    // Quantity Required input
    const quantityRequiredInput = document.createElement("input");
    quantityRequiredInput.type = "number";
    quantityRequiredInput.className = "quantity-required";
    quantityRequiredInput.placeholder = "Quantity Required (kg)";
    quantityRequiredInput.value = quantityRequired;
    quantityRequiredInput.step = "0.01";
    fruitUsageDiv.appendChild(quantityRequiredInput);

    // Remove button
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-fruit-btn";
    removeButton.textContent = "Remove";
    removeButton.onclick = function () {
        removeFruitUsage(index);
    };
    fruitUsageDiv.appendChild(removeButton);

    // Append the new field to the container
    fruitUsagesContainer.appendChild(fruitUsageDiv);
}

function removeFruitUsage(index) {
    const fruitUsageDiv = document.getElementById(`fruit-usage-${index}`);
    fruitUsageDiv.remove();
}

document.getElementById("add-fruit-btn").addEventListener("click", () => {
    fruitUsageCount++;
    addFruitUsageField("", 0, fruitUsageCount);
});

document.getElementById("edit-item-form").onsubmit = function (event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById("edit-juice-name").value;
    const price = parseFloat(document.getElementById("edit-juice-price").value);

    // Collect the fruit usage data
    const fruitUsages = [];
    const fruitUsageDivs = document.querySelectorAll(".fruit-usage");

    fruitUsageDivs.forEach((div) => {
        const fruitName = div.querySelector(".fruit-name").value;
        const quantityRequired = parseFloat(div.querySelector(".quantity-required").value);

        if (fruitName && !isNaN(quantityRequired)) {
            fruitUsages.push({ fruitName, quantityRequired });
        }
    });

    // Prepare the data to send with the PUT request
    const updatedJuiceData = {
        name: name,
        price: price,
        fruitUsages: fruitUsages,
    };

    // Get the juice ID (You should pass the juice ID when opening the modal)
    const juiceId = document.getElementById("edit-juice-modal").dataset.juiceId;

    // Send the PUT request to update the juice
    fetch(`http://localhost:8080/api/juice/${juiceId}?newPrice=${price}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedJuiceData), // Send the updated juice data
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message
            showSuccessMessage("Juice details updated successfully!");
            // Close the modal
            document.getElementById("edit-juice-modal").style.display = "none";
        } else {
            alert("Failed to update juice details.");
            console.log(updatedJuiceData);
        }
    })
    .catch(error => console.error('Error updating juice:', error));
};

// Function to close the modal when the user clicks 'Close'
document.getElementById("close-edit-modal").addEventListener("click", () => {
    document.getElementById("edit-juice-modal").style.display = "none"; // Hide the modal
});



// Function to populate the juice table
// Event listener for delete button click
document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('delete-btn')) {
        // Get the juice ID from the button's data attribute
        const juiceId = event.target.dataset.juiceId;

        // Show the confirmation modal
        const deleteModal = document.getElementById('delete-juice-modal');
        deleteModal.style.display = 'block';

        // Set up the confirmation handler
        const confirmDeleteButton = document.getElementById('confirm-delete');
        confirmDeleteButton.onclick = function () {
            // Send the DELETE request to the API
            fetch(`http://localhost:8080/api/juice/${juiceId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        // Close the modal
                        deleteModal.style.display = 'none';

                        // Show success message
                        showSuccessMessage('Juice deleted successfully');

                        // Remove the row from the table
                        event.target.closest('tr').remove(); // Remove the deleted juice row
                    } else {
                        // Show error message if delete fails
                        showErrorMessage('Failed to delete the juice');
                    }
                })
                .catch(error => {
                    console.error('Error deleting juice:', error);
                    showErrorMessage('An error occurred while deleting the juice');
                });
        };

        // Cancel delete action
        const cancelDeleteButton = document.getElementById('cancel-delete');
        cancelDeleteButton.onclick = function () {
            deleteModal.style.display = 'none'; // Close the modal
        };
    }
});

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


// Call the fetchJuiceData function when the page loads
document.addEventListener('DOMContentLoaded', fetchJuiceData);

document.addEventListener('DOMContentLoaded', () => {
    const addJuiceBtn = document.getElementById('add-item-btn');
    const addJuiceModal = document.getElementById('add-juice-modal');
    const closeAddJuiceModalBtn = document.getElementById('close-add-juice-modal');
    const addJuiceForm = document.getElementById('add-juice-form');
    const fruitUsageContainer = document.getElementById('fruit-usage-container');
    const addFruitUsageBtn = document.getElementById('add-fruit-usage-btn');

    // Show modal
    addJuiceBtn.addEventListener('click', () => {
        addJuiceModal.style.display = 'flex';
    });

    // Close modal
    closeAddJuiceModalBtn.addEventListener('click', () => {
        addJuiceModal.style.display = 'none';
    });

    // Dynamically add fruit usage fields
    addFruitUsageBtn.addEventListener('click', () => {
        const fruitUsageDiv = document.createElement('div');
        fruitUsageDiv.classList.add('fruit-usage');

        fruitUsageDiv.innerHTML = `
            <input type="text" class="fruit-name" placeholder="Fruit Name" required>
            <input type="number" class="quantity-required" placeholder="Quantity (kg)" step="0.01" required>
        `;

        fruitUsageContainer.appendChild(fruitUsageDiv);
    });

    // Handle form submission
    addJuiceForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const juiceName = document.getElementById('juice-name').value;
        const juicePrice = parseFloat(document.getElementById('juice-price').value);
        const fruitUsages = Array.from(fruitUsageContainer.querySelectorAll('.fruit-usage')).map(fruitUsage => ({
            fruitName: fruitUsage.querySelector('.fruit-name').value,
            quantityRequired: parseFloat(fruitUsage.querySelector('.quantity-required').value),
        }));

        const newJuice = {
            name: juiceName,
            price: juicePrice,
            fruitUsages: fruitUsages,
        };

        try {
            const response = await fetch('http://localhost:8080/api/juice/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newJuice),
            });

            if (response.ok) {
                showSuccessMessage('Juice added successfully!');
                setTimeout(() => {
                    addJuiceModal.style.display = 'none';
                    addJuiceForm.reset(); // Clear the form
                    fruitUsageContainer.innerHTML = ''; // Remove dynamically added fruit usages
                }, 1500);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error adding juice:', error);
        }
    });

    // Success message
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
});
