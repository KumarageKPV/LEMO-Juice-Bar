package com.example.mywebapp.controller;

import com.example.mywebapp.model.Inventory;
import com.example.mywebapp.service.ExportService;
import com.example.mywebapp.service.ReportService;
import com.example.mywebapp.model.Sales;
import com.example.mywebapp.model.Juice;
import com.example.mywebapp.model.Supplier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final ExportService exportService;

    public ReportController(ReportService reportService, ExportService exportService) {
        this.reportService = reportService;
        this.exportService = exportService;
    }

    // Endpoint to generate a sales report (returns as JSON)
    @GetMapping("/sales")
    public ResponseEntity<?> getSalesReport(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            List<Sales> salesReport = reportService.generateSalesReport(startDate, endDate);
            return ResponseEntity.ok(salesReport);
        } catch (Exception e) {
            // Handle exception and return an error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating sales report: " + e.getMessage());
        }
    }

    // Endpoint to generate an inventory report as JSON
    @GetMapping("/inventory")
    public ResponseEntity<List<Inventory>> getInventoryReport() {
        try {
            List<Inventory> inventoryList = reportService.generateInventoryReport();
            // Replace any null prices with a default value (e.g., 0.0)
            // for (Inventory inventory : inventoryList) {
            //    if (inventory.getPrice() == null) {
            //        inventory.setPrice(0.0);  // Default value for price
            //    }
            // }

            return ResponseEntity.ok(inventoryList);
        } catch (Exception e) {
            // Return an error response if there's an issue generating the report
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);  // Or provide a meaningful error message
        }
    }

    // Endpoint to export the inventory report as PDF
    @GetMapping("/inventory/export/pdf")
    public void exportInventoryToPdf(HttpServletResponse response) {
        try {
            // Set the content type for PDF
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "inline; filename=inventory_report.pdf");

            // Fetch the inventory data
            List<Inventory> inventoryList = reportService.generateInventoryReport();

            // Check if the inventory data is empty and return a message if no data is found
            if (inventoryList == null || inventoryList.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT); // No content found
                response.getWriter().write("No inventory data found.");
                return;
            }

            // Call the exportInventoryToPdf method from ExportService to generate the PDF
            exportService.exportInventoryToPdf(inventoryList, response.getOutputStream());

        } catch (IOException e) {
            handleError(response, "Error exporting inventory report to PDF", e);
        } catch (Exception e) {
            handleError(response, "Unexpected error during report export", e);
        }
    }


    // Endpoint to export the sales report as CSV
    @GetMapping("/sales/export/csv")
    public void exportSalesToCsv(@RequestParam String startDate,
                                 @RequestParam String endDate,
                                 HttpServletResponse response) {
        try {
            // Set the content type and the download file header
            response.setContentType("text/csv");
            response.setHeader("Content-Disposition", "attachment; filename=sales_report.csv");

            // Fetch the sales data for the specified date range
            List<Sales> salesList = reportService.generateSalesReport(startDate, endDate);
            if (salesList.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT); // No content found
                response.getWriter().write("No sales data found for the specified date range.");
                return;
            }

            // Pass the OutputStream from the response to the service method
            exportService.exportSalesToCsv(salesList, response.getOutputStream());
        } catch (IOException e) {
            handleError(response, "Error exporting sales report to CSV", e);
        } catch (Exception e) {
            handleError(response, "Unexpected error during report export", e);
        }
    }

    // Endpoint to export the sales report as PDF
    @GetMapping("/sales/export/pdf")
    public void exportSalesToPdf(@RequestParam String startDate,
                                 @RequestParam String endDate,
                                 HttpServletResponse response) {
        try {
            // Set the content type for PDF
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "inline; filename=sales_report.pdf");

            // Fetch the sales data
            List<Sales> salesList = reportService.generateSalesReport(startDate, endDate);

            // Check if the sales data is empty and return a message if no data is found
            if (salesList == null || salesList.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT); // No content found
                response.getWriter().write("No sales data found for the specified date range.");
                return;
            }

            // Call the exportSalesToPdf method from ExportService to generate the PDF
            exportService.exportSalesToPdf(salesList, response.getOutputStream());

        } catch (IOException e) {
            handleError(response, "Error exporting sales report to PDF", e);
        } catch (Exception e) {
            handleError(response, "Unexpected error during report export", e);
        }
    }

    @GetMapping("/inventory/export/csv")
    public void exportInventoryToCsv(HttpServletResponse response) {
        try {
            response.setContentType("text/csv");
            response.setHeader("Content-Disposition", "attachment; filename=\"inventory_report.csv\"");

            List<Inventory> inventoryList = reportService.generateInventoryReport(); // Fetch inventory data

            if (inventoryList == null || inventoryList.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                response.getWriter().write("No inventory data found.");
                response.getWriter().flush();
                response.getWriter().close();
                return;
            }


            exportService.exportInventoryToCsv(inventoryList, response.getOutputStream());
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }

    // Endpoint to generate a juice performance report
    @GetMapping("/juice")
    public ResponseEntity<?> getJuicePerformanceReport() {
        try {
            return ResponseEntity.ok(reportService.generateJuicePerformanceReport());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating juice performance report: " + e.getMessage());
        }
    }

    @GetMapping("/juice/export/csv")
    public void exportJuiceToCsv(HttpServletResponse response) {
        try {
            // Set the response headers for CSV content
            response.setContentType("text/csv");
            response.setHeader("Content-Disposition", "attachment; filename=\"juice_report.csv\"");

            // Fetch the juice performance data (assuming the method returns a list of Map objects)
            List<Map<String, Object>> juiceList = reportService.generateJuicePerformanceReport();

            if (juiceList == null || juiceList.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                response.getWriter().write("No juice data found.");
                response.getWriter().flush();
                return;
            }

            // Export juice data to CSV
            exportService.exportJuiceToCsv(juiceList, response.getOutputStream());
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }

    // Endpoint to export the juice report as PDF
    @GetMapping("/juice/export/pdf")
    public void exportJuiceToPdf(HttpServletResponse response) {
        try {
            // Set the content type for PDF
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "inline; filename=juice_report.pdf");

            // Fetch the juice performance data
            List<Map<String, Object>> juiceList = reportService.generateJuicePerformanceReport();

            // Check if the juice data is empty and return a message if no data is found
            if (juiceList == null || juiceList.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT); // No content found
                response.getWriter().write("No juice data found.");
                return;
            }

            // Call the exportJuiceToPdf method from ExportService to generate the PDF
            exportService.exportJuiceToPdf(juiceList, response.getOutputStream());

        } catch (IOException e) {
            handleError(response, "Error exporting juice report to PDF", e);
        } catch (Exception e) {
            handleError(response, "Unexpected error during report export", e);
        }
    }

    @GetMapping("/supplier")
    public ResponseEntity<?> exportSupplierToJson() {
        try {
            List<Supplier> supplierList = reportService.generateSupplierReport(); // Fetch supplier data
            if (supplierList.isEmpty()) {
                return ResponseEntity.noContent().build(); // No content
            }
            return ResponseEntity.ok(supplierList); // Return the supplier list as JSON
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error exporting supplier report to JSON");
        }
    }

    @GetMapping("/supplier/export/csv")
    public void exportSupplierToCsv(HttpServletResponse response) {
        try {
            response.setContentType("text/csv");
            response.setHeader("Content-Disposition", "attachment; filename=\"supplier_report.csv\"");

            List<Supplier> supplierList = reportService.generateSupplierReport(); // Fetch supplier data

            if (supplierList.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                response.getWriter().write("No supplier data found.");
                response.getWriter().flush();
                return;
            }

            exportService.exportSupplierToCsv(supplierList, response.getOutputStream()); // Call the export service for CSV
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }



    @GetMapping("/supplier/export/pdf")
    public void exportSupplierToPdf(HttpServletResponse response) {
        try {
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "inline; filename=\"supplier_report.pdf\"");

            List<Supplier> supplierList = reportService.generateSupplierReport(); // Fetch supplier data

            if (supplierList.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                response.getWriter().write("No supplier data found.");
                return;
            }

            exportService.exportSupplierToPdf(supplierList, response.getOutputStream()); // Call the export service for PDF
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }







    // Helper method to handle errors and send a response
    private void handleError(HttpServletResponse response, String errorMessage, Exception e) {
        try {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(errorMessage + ": " + e.getMessage());
            e.printStackTrace();
        } catch (IOException ioException) {
            ioException.printStackTrace();
        }
    }
}
