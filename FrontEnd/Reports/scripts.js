// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Attach event listener for the generate report button
    const generateReportButton = document.getElementById('generate-report-btn');
    
    if (generateReportButton) {
        generateReportButton.addEventListener('click', generateReport);
    } else {
        console.error('Generate report button not found!');
    }
});

// Function to fetch data and update tables and charts
function generateReport() {
    // Get the selected filters
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const product = document.getElementById('product-filter').value;
    const supplier = document.getElementById('supplier-filter').value;

    // Fetch data from the backend based on selected filters
    fetch(`http://localhost:8080/api/reports/sales?startDate=${startDate}&endDate=${endDate}&product=${product}&supplier=${supplier}`)
        .then(response => response.json())
        .then(data => {
            // Update tables with the fetched data
            updateSalesTable(data.sales);
            updateInventoryTable(data.inventory);
            updateSupplierData(data.suppliers);

            // Update the sales graph
            updateSalesGraph(data.sales);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to update the sales table
function updateSalesTable(salesData) {
    const table = document.getElementById('sales-table').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear the existing rows

    salesData.forEach(sale => {
        const row = table.insertRow();
        row.insertCell(0).innerText = sale.productName;
        row.insertCell(1).innerText = sale.quantity;
        row.insertCell(2).innerText = sale.revenue;
        row.insertCell(3).innerText = sale.date;
        row.insertCell(4).innerText = sale.customerName;
    });
}

// Function to update the inventory table
function updateInventoryTable(inventoryData) {
    const table = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear the existing rows

    inventoryData.forEach(item => {
        const row = table.insertRow();
        row.insertCell(0).innerText = item.productName;
        row.insertCell(1).innerText = item.initialStock;
        row.insertCell(2).innerText = item.stockUsed;
        row.insertCell(3).innerText = item.remainingStock;
    });
}

// Function to update the supplier data (if needed)
function updateSupplierData(supplierData) {
    const table = document.getElementById('supplier-table').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear the existing rows

    supplierData.forEach(supplier => {
        const row = table.insertRow();
        row.insertCell(0).innerText = supplier.name;
        row.insertCell(1).innerText = supplier.email;
        row.insertCell(2).innerText = supplier.phone;
    });
}

// Function to update the sales graph using Chart.js
function updateSalesGraph(salesData) {
    const ctx = document.getElementById('sales-over-time').getContext('2d');
    const labels = salesData.map(sale => sale.date);
    const salesAmounts = salesData.map(sale => sale.revenue);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Sales Revenue',
            data: salesAmounts,
            backgroundColor: '#4a90e2',
            borderColor: '#357ab7',
            borderWidth: 1,
            fill: false
        }]
    };

    const config = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    };

    const salesChart = new Chart(ctx, config);
}

// Function to export the table data to CSV format
function exportCSV() {
    const table = document.getElementById('sales-table');
    let csvContent = "data:text/csv;charset=utf-8,";

    for (let row of table.rows) {
        let rowData = [];
        for (let cell of row.cells) {
            rowData.push(cell.textContent);
        }
        csvContent += rowData.join(",") + "\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sales_report.csv');
    link.click();
}

// Function to export the report as PDF using jsPDF
function exportPDF() {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Sales Report", 10, 10);

    const table = document.getElementById('sales-table');
    const tableData = [];

    for (let row of table.rows) {
        const rowData = [];
        for (let cell of row.cells) {
            rowData.push(cell.textContent);
        }
        tableData.push(rowData);
    }

    doc.autoTable({
        head: [['Product Name', 'Quantity', 'Revenue', 'Date', 'Customer']],
        body: tableData,
        startY: 20
    });

    doc.save('sales_report.pdf');
}
