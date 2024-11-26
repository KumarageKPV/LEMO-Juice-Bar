package com.example.mywebapp.service;

import com.example.mywebapp.model.Inventory;
import com.example.mywebapp.model.Juice;
import com.example.mywebapp.model.Sales;
import com.example.mywebapp.repository.InventoryRepository;
import com.example.mywebapp.repository.JuiceRepository;
import com.example.mywebapp.repository.SalesRepository;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {
    private final SalesRepository salesRepository;
    private final InventoryRepository inventoryRepository;
    private final JuiceRepository juiceRepository;

    public ReportService(SalesRepository salesRepository,
                         InventoryRepository inventoryRepository,
                         JuiceRepository juiceRepository) {
        this.salesRepository = salesRepository;
        this.inventoryRepository = inventoryRepository;
        this.juiceRepository = juiceRepository;
    }

    // Generate a sales report based on a date range
    public List<Sales> generateSalesReport(String startDate, String endDate) {
        return salesRepository.findSalesByDateRange(
                Date.valueOf(startDate), Date.valueOf(endDate));
    }

    // Generate an inventory report showing current stock
    public List<Inventory> generateInventoryReport() {
        return inventoryRepository.findAll();
    }

    public List<Map<String, Object>> generateJuicePerformanceReport() {
        List<Object[]> results = juiceRepository.findTopSellingJuices(); // Get results from query
        List<Map<String, Object>> performanceReport = new ArrayList<>();

        for (Object[] result : results) {
            Juice juice = (Juice) result[0]; // Juice entity
            Long totalSold = (Long) result[1]; // Total sold quantity

            // Map to store performance details
            Map<String, Object> juiceData = new HashMap<>();
            juiceData.put("id", juice.getId());
            juiceData.put("name", juice.getName());
            juiceData.put("price", juice.getPrice());
            juiceData.put("totalSold", totalSold);

            performanceReport.add(juiceData); // Add to the report
        }

        return performanceReport; // Return the report as a list of maps
    }

}
