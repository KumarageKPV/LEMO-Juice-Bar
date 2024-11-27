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

// Function to fetch data and update tables and charts
// Function to generate report and fetch data dynamically from the backend
async function generateReport() {
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
    } catch (error) {
      // console.error("Error fetching sales data:", error);
      // alert("Error fetching sales data. Please try again.");
    }
  }
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
  const ctx = document.getElementById("sales-over-time-chart").getContext("2d");
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
      },
    },
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
  const ctx = document.getElementById("sales-over-time-chart").getContext("2d");

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
  const ctx = document
    .getElementById("top-selling-juices-chart")
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
      },
    },
  });
}
