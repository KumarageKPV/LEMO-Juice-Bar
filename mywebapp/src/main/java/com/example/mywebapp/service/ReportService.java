package com.example.mywebapp.service;

import com.example.mywebapp.model.*;
import com.example.mywebapp.repository.InventoryRepository;
import com.example.mywebapp.repository.JuiceRepository;
import com.example.mywebapp.repository.SalesRepository;
import com.example.mywebapp.repository.SupplierRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {
    @Autowired
    private final SalesRepository salesRepository;
    private final InventoryRepository inventoryRepository;
    private final JuiceRepository juiceRepository;
    private final SupplierRepository supplierRepository; // Added missing @Autowired for SupplierRepository

    @Autowired
    public ReportService(SalesRepository salesRepository,
                         InventoryRepository inventoryRepository,
                         JuiceRepository juiceRepository,
                         SupplierRepository supplierRepository) {
        this.salesRepository = salesRepository;
        this.inventoryRepository = inventoryRepository;
        this.juiceRepository = juiceRepository;
        this.supplierRepository = supplierRepository; // Initialize supplierRepository
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

    @Transactional
    public List<Map<String, Object>> generateJuicePerformanceReport() {
        List<Map<String, Object>> performanceReport = new ArrayList<>();

        // Step 1: Get top-selling juices from the query results
        List<Object[]> results = juiceRepository.findTopSellingJuices(); // Assuming you have this query in your repository

        // Step 2: Fetch all juices along with their fruitUsages
        List<Juice> juices = juiceRepository.findAllWithFruitUsages(); // Use @EntityGraph or JOIN FETCH

        // Create a map to look up the Juice objects by their IDs
        Map<Long, Juice> juiceMap = new HashMap<>();
        for (Juice juice : juices) {
            juiceMap.put(juice.getId(), juice);
        }

        // Step 3: Process the results and build the performance report
        for (Object[] result : results) {
            Juice juice = (Juice) result[0]; // Juice entity
            Long totalSold = (Long) result[1]; // Total sold quantity

            // Create a map for each juice's data
            Map<String, Object> juiceData = new HashMap<>();
            juiceData.put("id", juice.getId());
            juiceData.put("name", juice.getName());
            juiceData.put("price", juice.getPrice());
            juiceData.put("totalSold", totalSold);

            // Fetch and process the fruit usage details (ingredients)
            List<Map<String, Object>> fruitUsages = new ArrayList<>();
            Juice fullJuice = juiceMap.get(juice.getId()); // Get the full juice with fruitUsages

            if (fullJuice != null && fullJuice.getFruitUsages() != null) {
                for (FruitUsage fruitUsage : fullJuice.getFruitUsages()) {
                    Map<String, Object> fruitUsageData = new HashMap<>();
                    fruitUsageData.put("fruitName", fruitUsage.getFruitName());
                    fruitUsageData.put("quantityRequired", fruitUsage.getQuantityRequired());
                    fruitUsages.add(fruitUsageData);
                }
                juiceData.put("fruitUsages", fruitUsages);
            } else {
                juiceData.put("fruitUsages", "No ingredients available.");
            }

            // Add the juice data to the performance report
            performanceReport.add(juiceData);
        }

        return performanceReport; // Return the complete performance report
    }
    // Method to generate the supplier report
    public List<Supplier> generateSupplierReport() {
        // Fetch all suppliers from the repository (can be modified if any filtering is needed)
        return supplierRepository.findAll(); // This will return all suppliers
    }
}
