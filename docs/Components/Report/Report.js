window.onload = function() {
  
};

// Function to open the modal
function openModal() {
  document.getElementById("report-modal").style.display = "block";
}

// Function to close the modal
function closeModal() {
  document.getElementById("report-modal").style.display = "none";
}

function toggleDateFields() {
  const reportType = document.getElementById('report-type').value;
  const startDateLabel = document.getElementById('start-date-label');
  const startDateInput = document.getElementById('start-date');
  const endDateLabel = document.getElementById('end-date-label');
  const endDateInput = document.getElementById('end-date');

  // Show the date fields only if "sales" is selected
  if (reportType === 'sales') {
      startDateLabel.style.display = 'inline';
      startDateInput.style.display = 'inline';
      endDateLabel.style.display = 'inline';
      endDateInput.style.display = 'inline';
  } else {
      startDateLabel.style.display = 'none';
      startDateInput.style.display = 'none';
      endDateLabel.style.display = 'none';
      endDateInput.style.display = 'none';
  }
}

// Initialize the function to run when the page loads
window.onload = function() {
  openModal();
  toggleDateFields();  // Ensure date fields are hidden initially unless 'sales' is selected
};


// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Attach event listener for the generate report button
  const generateReportButton = document.getElementById("generate-report-btn");

  if (generateReportButton) {
    generateReportButton.addEventListener("click", generateReport);
  } else {
    console.error("Generate report button not found!");
  }
});

document.getElementById('export-report-btn').addEventListener('click', function () {
  const reportType = document.getElementById("report-type").value;
  let url;

  // Dynamic URL generation based on the report type
  if (reportType === "sales") {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    // Validate date inputs for sales report
    if (!startDate || !endDate) {
      alert("Please select both start and end dates for the sales report.");
      return;
    }

    url = `http://localhost:8080/api/reports/sales/export/csv?startDate=${startDate}&endDate=${endDate}`;
  } else {
    url = `http://localhost:8080/api/reports/${reportType}/export/csv`;
  }

  // Fetch and download the report
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob(); // Get the blob response
    })
    .then(blob => {
      // Create a temporary download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = `${reportType}_report.csv`; // Set the file name
      document.body.appendChild(a);
      a.click(); // Trigger the download
      window.URL.revokeObjectURL(downloadUrl); // Clean up the URL object
      document.body.removeChild(a); // Remove the temporary link
    })
    .catch(error => {
      console.error('Error during file download:', error);
      alert('Failed to export the report. Please try again.');
    });
});



document.getElementById('export-pdf-report-btn').addEventListener('click', function () {
  const reportType = document.getElementById("report-type").value;
  let url;

  // Dynamic URL generation based on the report type
  if (reportType === "sales") {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    // Validate date inputs for sales report
    if (!startDate || !endDate) {
      alert("Please select both start and end dates for the sales report.");
      return;
    }

    url = `http://localhost:8080/api/reports/sales/export/pdf?startDate=${startDate}&endDate=${endDate}`;
  } else {
    url = `http://localhost:8080/api/reports/${reportType}/export/pdf`;
  }

  // Fetch and download the report
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob(); // Get the blob response
    })
    .then(blob => {
      // Create a temporary download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = `${reportType}_report.csv`; // Set the file name
      document.body.appendChild(a);
      a.click(); // Trigger the download
      window.URL.revokeObjectURL(downloadUrl); // Clean up the URL object
      document.body.removeChild(a); // Remove the temporary link
    })
    .catch(error => {
      console.error('Error during file download:', error);
      alert('Failed to export the report. Please try again.');
    });
});



// Function to fetch data and update tables and charts
// Function to generate report and fetch data dynamically from the backend
async function generateReport() {
  closeModal();
  document.querySelector('.export-buttons').style.display = 'flex';

  // Get the selected date filters
  const salesTable = document.querySelector(".sales-table");
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const reportType = document.getElementById("report-type").value;
  if (reportType === "sales") {
    salesTable.style.display = "block";
    // Validate inputs
    if (!startDate || !endDate) {
      alert("Please select both a start and end date.");
      return;
    }

    // Display loading or indication (optional)
    // document.getElementById("generate-report-btn").disabled = true;

    try {
      // Fetch the data from the backend using the selected date range
      const response = await fetch(
        `http://localhost:8080/api/reports/sales?startDate=${startDate}&endDate=${endDate}`
      );

      // Handle if the response is not okay
      if (!response.ok) throw new Error("Failed to fetch sales data");

      // Parse the response JSON
      const data = await response.json();

      // Call a function to process and display the report
      displayData(data);
      displayGraph(data);
      generateTopSellingJuicesChart(data);
    } catch (error) {
      //   console.error("Error fetching sales data:", error);
      //   alert("Error fetching sales data. Please try again.");
    } finally {
      // Re-enable the button
      document.getElementById("generate-report-btn").disabled = false;
    }
  } else if (reportType === "inventory") {
    //
    try {
      const response = await fetch(
        `http://localhost:8080/api/reports/inventory`
      );

      // Handle if the response is not okay
      if (!response.ok) throw new Error("Failed to fetch inventory data");

      // Parse the response JSON
      const data = await response.json();
      createInventoryLevelsByFruit(data);
      populateInventoryCards(data);
      displayInventoryTable(data);
    } catch (error) {
      // console.error("Error fetching sales data:", error);
      // alert("Error fetching sales data. Please try again.");
    }
  }else if (reportType === "juice") {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reports/juice`
      );

      // Handle if the response is not okay
      if (!response.ok) throw new Error("Failed to fetch juice data");
      const data =await response.json();
      populateJuiceCards(data);
      createBarChart(data);
      createPieChart(data);
      populateJuiceTable(data);

    }catch (error) {
      // console.error("Error fetching sales data:", error);
      // alert("Error fetching sales data. Please try again.");
    }
  }
  else if(reportType == "supplier"){
    try {
      const response = await fetch(
        `http://localhost:8080/api/reports/supplier`
      );
      if(response.ok){  
        const data =await response.json();
        createSupplierTable(data);

      }
    }catch (error) {
      // console.error("Error fetching sales data:", error);
      // alert("Error fetching sales data. Please try again.");
    }
  }
}
function createSupplierTable(data) {
  // Get the table container and make it visible
  const tableContainer = document.getElementById("supplier-table-container");
  tableContainer.style.display = "block";  // Show the table container

  // Get the table body
  const tableBody = document.querySelector("#supplier-table tbody");

  // Clear any existing rows in the table body
  tableBody.innerHTML = "";

  // Loop through the data array and create a row for each supplier
  data.forEach(item => {
      const row = document.createElement("tr");

      // Add ID cell
      const idCell = document.createElement("td");
      idCell.style.border = "1px solid #ddd";
      idCell.style.padding = "8px";
      idCell.textContent = item.id || "N/A"; // Fallback to "N/A" if id is missing
      row.appendChild(idCell);

      // Add Name cell
      const nameCell = document.createElement("td");
      nameCell.style.border = "1px solid #ddd";
      nameCell.style.padding = "8px";
      nameCell.textContent = item.name || "N/A"; // Fallback to "N/A" if name is missing
      row.appendChild(nameCell);

      // Add Email cell
      const emailCell = document.createElement("td");
      emailCell.style.border = "1px solid #ddd";
      emailCell.style.padding = "8px";
      emailCell.textContent = item.email || "N/A"; // Fallback to "N/A" if email is missing
      row.appendChild(emailCell);

      // Add Phone cell
      const phoneCell = document.createElement("td");
      phoneCell.style.border = "1px solid #ddd";
      phoneCell.style.padding = "8px";
      phoneCell.textContent = item.phone || "N/A"; // Fallback to "N/A" if phone is missing
      row.appendChild(phoneCell);

      // Append the row to the table body
      tableBody.appendChild(row);
  });
}

function populateJuiceTable(data) {
  // Get the table container and make it visible
  const tableContainer = document.getElementById("juice-table-container");
  tableContainer.style.display = "block";

  // Get the table body
  const tableBody = document.querySelector("#juice-table tbody");

  // Clear any existing rows in the table body
  tableBody.innerHTML = "";

  // Loop through the data array and create a row for each item
  data.forEach(item => {
      const row = document.createElement("tr");

      // Add Juice Name
      const juiceNameCell = document.createElement("td");
      juiceNameCell.style.border = "1px solid #ddd";
      juiceNameCell.style.padding = "8px";
      juiceNameCell.textContent = item.name || "N/A"; // Fallback to "N/A" if name is missing
      row.appendChild(juiceNameCell);

      // Add Price
      const priceCell = document.createElement("td");
      priceCell.style.border = "1px solid #ddd";
      priceCell.style.padding = "8px";
      priceCell.textContent = `$${item.price.toFixed(2)}` || "N/A"; // Format price to 2 decimal places
      row.appendChild(priceCell);

      // Add Total Sold
      const totalSoldCell = document.createElement("td");
      totalSoldCell.style.border = "1px solid #ddd";
      totalSoldCell.style.padding = "8px";
      totalSoldCell.textContent = item.totalSold || "N/A"; // Fallback to "N/A" if totalSold is missing
      row.appendChild(totalSoldCell);

      // Append the row to the table body
      tableBody.appendChild(row);
  });
}

function createPieChart(data) {
  // Hide all canvas elements first
  document.querySelectorAll('canvas').forEach(canvas => {
      canvas.style.display = 'none';
  });

  // Show the relevant canvas for the pie chart
  const pieContainer = document.getElementById("juice-revenue-chart-container");
  const canvas = document.getElementById("juice-revenue-chart");
  canvas.style.display = 'block';  // Show the canvas for the pie chart
  pieContainer.style.display = "block";

  // Prepare the context for Chart.js
  const ctx = canvas.getContext("2d");

  // Calculate revenue for each juice and total revenue
  const juiceNames = data.map(juice => juice.name);
  const revenues = data.map(juice => juice.price * juice.totalSold); // Revenue = price * totalSold
  const totalRevenue = revenues.reduce((acc, revenue) => acc + revenue, 0);

  // Calculate percentage for each juice
  const revenuePercentages = revenues.map(revenue => (revenue / totalRevenue) * 100);

  // Create the pie chart using Chart.js
  new Chart(ctx, {
      type: 'pie',  // Pie chart type
      data: {
          labels: juiceNames,  // Labels for the slices (juice names)
          datasets: [{
              data: revenuePercentages,  // Revenue percentage for each juice
              backgroundColor: ['#ffad33', '#4a90e2', '#e94e77', '#39d9c2', '#f0a2ff'],  // Pie slice colors
              borderColor: '#ffffff',  // Border color for each slice
              borderWidth: 1           // Border width for each slice
          }]
      },
      options: {
          responsive: true, // Make chart responsive
          maintainAspectRatio: true, 
          plugins: {
              legend: {
                  position: 'top', // Position of the legend
                  labels: {
                      fontSize: 14  // Font size for the legend labels
                  }
              },
              title: {
                  display: true,
                  text: 'Revenue by Juice',  // Title text
                  font: {
                      size: 18
                  },
                  padding:{
                    top:30,
                    bottom:20
                  }
                  
              },
              tooltip: {
                  callbacks: {
                      label: function(tooltipItem) {
                          // Format the tooltip to show both juice name and percentage
                          const label = tooltipItem.label;
                          const percentage = tooltipItem.raw.toFixed(2);  // Get percentage with 2 decimals
                          return `${label}: ${percentage}%`;
                      }
                  }
              }
          }
      }
  });
}
function createBarChart(data) {
  // Prepare the canvas element for the chart
  const canvas = document.getElementById("juice-sales-chart");
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");

  // Extract juice names and total sold from the data
  const juiceNames = data.map(juice => juice.name);
  const totalSold = data.map(juice => juice.totalSold);

  // Create the bar chart using Chart.js
  new Chart(ctx, {
      type: 'bar',  // Bar chart type
      data: {
          labels: juiceNames,  // Labels for the x-axis (juice names)
          datasets: [{
              label: 'Total Sold',
              data: totalSold,  // Data for the y-axis (total sold)
              backgroundColor: '#4a90e2',  // Bar color
              borderColor: '#0066cc',      // Bar border color
              borderWidth: 1              // Border width
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: true,  // Make chart responsive
          scales: {
              x: {
                  title: {
                      display: true,
                      text: 'Juice Name'
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: 'Total Sold'
                  },
                  beginAtZero: true // Make sure the y-axis starts from 0
              }
          },
          plugins: {
              legend: {
                  display: false  // Hide the legend (optional)
              },
              title: {
                  display: true,
                  text: 'Juice Sales',
                  font: {
                      size: 20,
                  },
                  padding:{
                      top: 20,
                      bottom: 20
                  }
              }
          }
      }
  });
}

function populateJuiceCards(data) {
  const juiceCardsContainer = document.getElementById("juice-cards-container");

  // Clear any existing cards before adding new ones
  juiceCardsContainer.innerHTML = "";

  // Calculate top-selling juice, average price, and total revenue
  let topSellingJuice = data[0];
  let totalRevenue = 0;
  let totalSold = 0;

  data.forEach(juice => {
      if (juice.totalSold > topSellingJuice.totalSold) {
          topSellingJuice = juice;
      }
      totalSold += juice.totalSold;
      totalRevenue += juice.price * juice.totalSold;
  });

  const averagePrice = totalRevenue / totalSold;

  // Card 1: Top-Selling Juice
  const topSellingCard = createCard('Top-Selling Juice', topSellingJuice.name, `Sold: ${topSellingJuice.totalSold}`);
  juiceCardsContainer.appendChild(topSellingCard);

  // Card 2: Average Price for a Juice
  const averagePriceCard = createCard('Average Price', `$${averagePrice.toFixed(2)}`, `Calculated from ${data.length} juices`);
  juiceCardsContainer.appendChild(averagePriceCard);

  // Card 3: Total Revenue
  const totalRevenueCard = createCard('Total Revenue', `$${totalRevenue.toFixed(2)}`, `From all juices sold`);
  juiceCardsContainer.appendChild(totalRevenueCard);
  juiceCardsContainer.style.display = "flex";
}

// Helper function to create a card with inline styles
function createCard(title, value, description) {
  const card = document.createElement("div");
  
  // Inline CSS for the card
  card.style.backgroundColor = "#4a90e2";  // Card background color
  card.style.color = "white";               // Text color
  card.style.padding = "20px";              // Padding
  card.style.borderRadius = "8px";          // Border radius
  card.style.textAlign = "center";          // Text alignment
  card.style.width = "30%";                 // Width for each card
  card.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"; // Box shadow
  card.style.margin = "10px";               // Margin between cards

  const cardTitle = document.createElement("h3");
  cardTitle.textContent = title;
  card.appendChild(cardTitle);

  const cardValue = document.createElement("p");
  cardValue.textContent = value;
  card.appendChild(cardValue);

  const cardDescription = document.createElement("p");
  cardDescription.textContent = description;
  card.appendChild(cardDescription);

  return card;
}





function displayInventoryTable(data) {
  // Get the table container
  const tableContainer = document.getElementById("inventory-table-container");

  // Make the table visible
  tableContainer.style.display = "block";

  // Get the table body and clear existing rows
  const tableBody = document.querySelector("#inventory-table tbody");
  tableBody.innerHTML = "";

  // Populate the table with data
  data.forEach(item => {
      const row = document.createElement("tr");

      // Add Fruit Name
      const fruitNameCell = document.createElement("td");
      fruitNameCell.style.border = "1px solid #ddd";
      fruitNameCell.style.padding = "8px";
      fruitNameCell.textContent = item.fruitName || "N/A";
      row.appendChild(fruitNameCell);

      // Add Quantity
      const quantityCell = document.createElement("td");
      quantityCell.style.border = "1px solid #ddd";
      quantityCell.style.padding = "8px";
      quantityCell.textContent = item.quantity || "N/A";
      row.appendChild(quantityCell);

      // Add Category
      const categoryCell = document.createElement("td");
      categoryCell.style.border = "1px solid #ddd";
      categoryCell.style.padding = "8px";
      categoryCell.textContent = item.category || "N/A";
      row.appendChild(categoryCell);

      tableBody.appendChild(row);
  });
}


function populateInventoryCards(data) {
  // Get the container for the summary cards
  const summaryCardsContainer = document.getElementById("summary-cards");

  // Clear any existing cards
  summaryCardsContainer.innerHTML = "";

  // Count the total inventory items
  const totalInventoryCount = data.length;

  // Filter items for low stock (quantity < 0.5) and no stock (quantity === 0)
  const lowStockItems = data.filter(
    (item) => item.quantity < 0.5 && item.quantity > 0
  );
  const noStockItems = data.filter((item) => item.quantity === 0);

  // Create a card for the total inventory count
  const totalCard = document.createElement("div");
  totalCard.className = "card";
  totalCard.innerHTML = `
        <h3>Total Inventory Items</h3>
        <p>${totalInventoryCount}</p>
    `;
  summaryCardsContainer.appendChild(totalCard);

  // Create a card for low stock items
  const lowStockCard = document.createElement("div");
  lowStockCard.className = "card";
  lowStockCard.innerHTML = `
            <h3>Low Stock Items</h3>
            <p>${lowStockItems.length} item(s) below 0.5</p>
            <ul>${lowStockItems
              .map((item) => `<li>${item.fruitName}: ${item.quantity}</li>`)
              .join("")}</ul>
        `;
  summaryCardsContainer.appendChild(lowStockCard);

  // Create a card for no stock items
  const noStockCard = document.createElement("div");
  noStockCard.className = "card";
  noStockCard.innerHTML = `
            <h3>No Stock Items</h3>
            <p>${noStockItems.length} item(s) out of stock</p>`

  summaryCardsContainer.appendChild(noStockCard);

  // Ensure the container is visible
  summaryCardsContainer.style.display = "flex"; // Adjust display style as needed
}

function clearCanvas() {
  location.reload();
}
createInventoryLevelsByFruit = (data) => {
  const fruitNames = data.map((item) => item.fruitName);
  const quantities = data.map((item) => item.quantity);

  // Create the Bar Chart
  const canvas = document.getElementById("sales-over-time-chart");
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");
  const inventoryChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: fruitNames, // X-axis labels (fruit names)
      datasets: [
        {
          label: "Inventory Level (Quantity)",
          data: quantities, // Y-axis data (inventory quantity)
          backgroundColor: "rgba(54, 162, 235, 0.2)", // Bar color
          borderColor: "rgba(54, 162, 235, 1)", // Border color
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true, // Start Y-axis from zero
          title: {
            display: true,
            text: "Quantity",
          },
        },
        x: {
          title: {
            display: true,
            text: "Fruit Name",
          },
        },
      },
      plugins: {
        legend: {
          display: false, // Hide legend
        },
        title: {
          display: true,
          text: "Inventory Levels by Item",
          font:{
            size:20,
          
        },
        padding:{
          top:10,
          bottom:30,
        }
      },
    },}
  });
};

// Function to process and display the fetched data
function displayData(data) {
  let totalSales = 0;
  let totalRevenue = 0;
  let productSales = {};
  let fruitUsage = {};
  let dailySales = {}; // Track sales by day
  let averageRevenue = 0;
  const salesTable = document.getElementById("sales-data");

  // Clear previous table rows
  salesTable.innerHTML = "";

  // Loop through the fetched data (sales records)
  data.forEach((sale) => {
    totalSales++;
    totalRevenue += sale.price;

    // Update product sales count
    sale.saleItems.forEach((item) => {
      productSales[item.juice.name] =
        (productSales[item.juice.name] || 0) + item.quantity;

      // Update fruit usage count
      item.juice.fruitUsages.forEach((fruit) => {
        fruitUsage[fruit.fruitName] =
          (fruitUsage[fruit.fruitName] || 0) +
          fruit.quantityRequired * item.quantity;
      });
    });

    // Update daily sales count
    const saleDate = sale.sale_date.split("T")[0]; // Get only the date part (YYYY-MM-DD)
    dailySales[saleDate] = (dailySales[saleDate] || 0) + 1; // Count number of sales for each day

    // Populate table rows with sale details
    const row = `
        <tr>
          <td>${sale.sale_date}</td>
          <td>${sale.saleItems.map((item) => item.productName).join(", ")}</td>
          <td>${sale.saleItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          )}</td>
          <td>${sale.price}</td>
          <td>${sale.payment_method}</td>
        </tr>
      `;
    salesTable.innerHTML += row;
  });

  // Calculate the day with the most number of juices sold
  const mostSalesDay = Object.entries(dailySales).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // Calculate average revenue
  averageRevenue = totalRevenue / totalSales;

  // Find the top-selling product
  const topProduct = Object.entries(productSales).sort(
    (a, b) => b[1] - a[1]
  )[0];
  const mostUsedFruit = Object.entries(fruitUsage).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // Update summary cards with calculated values
  document.getElementById("total-sales-count").textContent = totalSales;
  document.getElementById("total-revenue").textContent =
    totalRevenue.toFixed(2);
  document.getElementById("top-product").textContent = topProduct
    ? `${topProduct[0]} (${topProduct[1]} units)`
    : "N/A";
  document.getElementById("most-used-fruit").textContent = mostUsedFruit
    ? `${mostUsedFruit[0]} (${mostUsedFruit[1]} kg)`
    : "N/A";
  document.getElementById("average-revenue").textContent =
    averageRevenue.toFixed(2);

  // Display the day with the most juices sold
  document.getElementById("most-sales-day").textContent = mostSalesDay
    ? `Date: ${mostSalesDay[0]} (${mostSalesDay[1]} sales)`
    : "N/A";

  // Display the summary cards (show after report is generated)
  document.getElementById("summary-cards").style.display = "flex";
}

function displayGraph(data) {
  let totalSales = 0;
  let totalRevenue = 0;
  const salesByDate = {}; // For storing sales by date

  // Loop through the fetched data (sales records)
  data.forEach((sale) => {
    totalSales++;
    totalRevenue += sale.price;

    // Group sales by date
    const saleDate = sale.sale_date.split("T")[0]; // Extract the date (remove time part)
    if (!salesByDate[saleDate]) {
      salesByDate[saleDate] = { sales: 0, revenue: 0 };
    }
    salesByDate[saleDate].sales += 1;
    salesByDate[saleDate].revenue += sale.price;
  });

  // Prepare the data for the line chart
  const chartLabels = Object.keys(salesByDate); // Dates
  const salesData = chartLabels.map((date) => salesByDate[date].sales); // Number of sales
  const revenueData = chartLabels.map((date) => salesByDate[date].revenue); // Revenue data

  // Create the Line Chart
  const canvas = document.getElementById("sales-over-time-chart");
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");

  // Destroy the existing chart if it's there
  if (window.salesOverTimeChart) {
    window.salesOverTimeChart.destroy();
  }

  // Create new chart instance
  window.salesOverTimeChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Number of Sales",
          data: salesData,
          borderColor: "rgb(75, 192, 192)",
          fill: false,
        },
        {
          label: "Total Revenue",
          data: revenueData,
          borderColor: "rgb(255, 99, 132)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          title: {
            display: true,
            text: "Sales/Revenue",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Sales and Revenue Over Time",
          font: {
            size: 20,
          },
          padding: {
            top: 10,
            bottom: 30,
          },
        },
      },
    },
  });
  

  // Update the summary information on the page (optional)
  document.getElementById("total-sales-count").textContent = totalSales;
  document.getElementById("total-revenue").textContent =
    totalRevenue.toFixed(2);
}

function generateTopSellingJuicesChart(data) {
  // Create an object to hold total quantity sold for each juice
  const juiceSales = {};

  // Loop through the data and aggregate quantities for each juice
  data.forEach((sale) => {
    sale.saleItems.forEach((item) => {
      const juiceName = item.juice.name;
      const quantitySold = item.quantity;

      // Aggregate the quantity sold for the juice
      if (juiceSales[juiceName]) {
        juiceSales[juiceName] += quantitySold;
      } else {
        juiceSales[juiceName] = quantitySold;
      }
    });
  });

  // Prepare data for the chart
  const juiceNames = Object.keys(juiceSales);
  const quantitiesSold = Object.values(juiceSales);

  // Create the bar chart
  const canvas = document.getElementById("top-selling-juices-chart");
  canvas.style.display = "block";
  const ctx = canvas
    .getContext("2d");

  const topSellingChart = new Chart(ctx, {
    type: "bar", // Bar chart type
    data: {
      labels: juiceNames, // X-axis labels (juice names)
      datasets: [
        {
          label: "Quantity Sold", // Y-axis label
          data: quantitiesSold, // Data for each juice's quantity sold
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Color of the bars
          borderColor: "rgba(75, 192, 192, 1)", // Border color of the bars
          borderWidth: 1, // Border width for the bars
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Juice Name", // X-axis title
          },
        },
        y: {
          title: {
            display: true,
            text: "Quantity Sold", // Y-axis title
          },
          beginAtZero: true, // Start the y-axis from zero
        },
      },
      plugins: {
        legend: {
          position: "top", // Position the legend at the top
        },
        title: {
          display: true,
          text: "Top Selling Juices", // Chart title
          font: {
            size: 20,
          },
          padding: {
            top: 10,
            bottom: 30,
          },
        },
      },
    },
  });
}
