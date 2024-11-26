package com.example.mywebapp.service;

import com.example.mywebapp.model.*;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.io.font.constants.StandardFonts;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class ExportService {

    // Export inventory report to CSV using OutputStream
    public void exportInventoryToCsv(List<Inventory> inventoryList, OutputStream outputStream) throws IOException {
        try (PrintWriter writer = new PrintWriter(outputStream)) {
            // Write CSV headers
            writer.println("ID,Name,Quantity");

            // Write data rows
            for (Inventory item : inventoryList) {
                writer.printf("%d,%s,%.2f%n", item.getId(), item.getFruitName(), item.getQuantity());
            }
        }
    }

    // Export sales report to CSV
    public void exportSalesToCsv(List<Sales> salesList, OutputStream outputStream) throws IOException {
        try (PrintWriter writer = new PrintWriter(outputStream)) {
            // Write CSV headers
            writer.println("Sale ID,Sale Date,Payment Method,Juice Name,Quantity,Price");

            // Write data rows
            for (Sales sale : salesList) {
                for (SalesItem item : sale.getSaleItems()) {
                    writer.printf("%d,%s,%s,%s,%d,%.2f%n",
                            sale.getId(),
                            sale.getSaleDate().toString(),
                            sale.getPaymentMethod(),
                            item.getProductName(),
                            item.getQuantity(),
                            sale.getPrice());
                }
            }
        }
    }

    // Export juice report to CSV (for Juice data)
    public void exportJuiceToCsv(List<Map<String, Object>> juiceList, OutputStream outputStream) throws IOException {
        try (PrintWriter writer = new PrintWriter(outputStream)) {
            // Write CSV headers
            writer.println("Juice ID,Juice Name,Price,Total Sold,Ingredients");

            // Loop through the juice list and write data rows to the CSV
            for (Map<String, Object> juiceData : juiceList) {
                // Get juice details
                String juiceId = juiceData.get("id").toString();
                String juiceName = (String) juiceData.get("name");
                Double price = (Double) juiceData.get("price");
                Integer totalSold = (Integer) juiceData.get("totalSold");

                // Write the basic juice details
                StringBuilder row = new StringBuilder();
                row.append(juiceId).append(",")
                        .append(juiceName).append(",")
                        .append(price).append(",")
                        .append(totalSold).append(",");

                // Get fruit usage details (ingredients)
                List<Map<String, Object>> fruitUsages = (List<Map<String, Object>>) juiceData.get("fruitUsages");
                if (fruitUsages != null && !fruitUsages.isEmpty()) {
                    // Join the fruit usage details with comma
                    StringBuilder ingredients = new StringBuilder();
                    for (Map<String, Object> fruitUsage : fruitUsages) {
                        String fruitName = (String) fruitUsage.get("fruitName");
                        Double quantityRequired = (Double) fruitUsage.get("quantityRequired");
                        ingredients.append(fruitName).append(": ").append(quantityRequired).append(" kg, ");
                    }
                    // Remove the last comma and space
                    ingredients.setLength(ingredients.length() - 2);
                    row.append(ingredients);
                } else {
                    row.append("No ingredients available.");
                }

                // Write the row to the CSV
                writer.println(row.toString());
            }
        }
    }


    // Export sales report to PDF (using iText)
    public void exportSalesToPdf(List<Sales> salesList, OutputStream outputStream) throws Exception {
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Title of the PDF
        document.add(new Paragraph("Sales Report").setFont(createBoldFont()).setFontSize(16));

        // Add sales details
        for (Sales sale : salesList) {
            document.add(new Paragraph("Sale ID: " + sale.getId()));
            document.add(new Paragraph("Date: " + sale.getSaleDate()));
            document.add(new Paragraph("Payment Method: " + sale.getPaymentMethod()));
            document.add(new Paragraph("Items:"));

            for (SalesItem item : sale.getSaleItems()) {
                document.add(new Paragraph("- " + item.getProductName() + ", Quantity: " + item.getQuantity()));
            }

            document.add(new Paragraph("Total Price: " + sale.getPrice()));
            document.add(new Paragraph("---------------------------"));
        }

        // Close the document after adding content
        document.close();
    }

    // Export inventory report to PDF (using iText)
    public void exportInventoryToPdf(List<Inventory> inventoryList, OutputStream outputStream) throws Exception {
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Title of the PDF
        document.add(new Paragraph("Inventory Report").setFont(createBoldFont()).setFontSize(16));

        // Add inventory details
        for (Inventory inventory : inventoryList) {
            document.add(new Paragraph("Inventory ID: " + inventory.getId()));
            document.add(new Paragraph("Fruit Name: " + inventory.getFruitName()));
            document.add(new Paragraph("Quantity: " + inventory.getQuantity()));
            document.add(new Paragraph("---------------------------"));
        }

        // Close the document after adding content
        document.close();
    }

    // Export juice report to PDF (using iText)
    public void exportJuiceToPdf(List<Map<String, Object>> juiceList, OutputStream outputStream) throws Exception {
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Title of the PDF
        document.add(new Paragraph("Juice Report").setFont(createBoldFont()).setFontSize(16));

        // Loop through juice list and add details to the PDF
        for (Map<String, Object> juiceData : juiceList) {
            document.add(new Paragraph("Juice ID: " + juiceData.get("id")));
            document.add(new Paragraph("Juice Name: " + juiceData.get("name")));
            document.add(new Paragraph("Price: " + juiceData.get("price")));
            document.add(new Paragraph("Total Sold: " + juiceData.get("totalSold"))); // Add total sold for performance
            document.add(new Paragraph("---------------------------"));

            // Add fruit usage details for the juice
            document.add(new Paragraph("Ingredients:"));
            // Assuming fruitUsages is part of the juice data map
            List<Map<String, Object>> fruitUsages = (List<Map<String, Object>>) juiceData.get("fruitUsages");  // Get the fruit usages

            if (fruitUsages != null && !fruitUsages.isEmpty()) {
                for (Map<String, Object> fruitUsage : fruitUsages) {
                    // Get fruitName and quantityRequired from the map
                    String fruitName = (String) fruitUsage.get("fruitName");
                    Double quantityRequired = (Double) fruitUsage.get("quantityRequired");

                    document.add(new Paragraph("- " + fruitName + ": " + quantityRequired + " kg"));
                }
            } else {
                document.add(new Paragraph("No ingredients available."));
            }

            document.add(new Paragraph("---------------------------"));
        }

        // Close the document
        document.close();
    }

    public void exportSupplierToCsv(List<Supplier> supplierList, OutputStream outputStream) throws IOException {
        try (PrintWriter writer = new PrintWriter(outputStream)) {
            // Write CSV headers
            writer.println("Supplier ID,Name,Email,Phone");

            // Loop through the supplier list and write data rows to the CSV
            for (Supplier supplier : supplierList) {
                writer.printf("%d,%s,%s,%s%n",
                        supplier.getId(),
                        supplier.getName(),
                        supplier.getEmail(),
                        supplier.getPhone());
            }
        }
    }

    public void exportSupplierToPdf(List<Supplier> supplierList, OutputStream outputStream) throws Exception {
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Title of the PDF
        document.add(new Paragraph("Supplier Report").setFont(createBoldFont()).setFontSize(16));

        // Loop through supplier list and add details to the PDF
        for (Supplier supplier : supplierList) {
            document.add(new Paragraph("Supplier ID: " + supplier.getId()));
            document.add(new Paragraph("Name: " + supplier.getName()));
            document.add(new Paragraph("Email: " + supplier.getEmail()));
            document.add(new Paragraph("Phone: " + supplier.getPhone()));
            document.add(new Paragraph("---------------------------"));
        }

        document.close(); // Close the document after adding the data
    }




    // Helper method to create a bold font for PDF
    private PdfFont createBoldFont() {
        try {
            return PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback to regular Helvetica if bold font creation fails
            try {
                return PdfFontFactory.createFont(StandardFonts.HELVETICA);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        }
    }
}
