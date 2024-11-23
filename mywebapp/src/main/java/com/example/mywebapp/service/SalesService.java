package com.example.mywebapp.service;

import com.example.mywebapp.model.FruitUsage;
import com.example.mywebapp.model.Juice;
import com.example.mywebapp.model.Sales;
import com.example.mywebapp.model.SalesItem;
import com.example.mywebapp.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SalesService {
    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private InventoryService inventoryService;

    // A map storing the fruit requirements for each juice


    public List<Sales> getAllSales() {
        return salesRepository.findAll();
    }

    public Sales getSalesById(int id) {
        return salesRepository.findById(id).orElse(null);
    }

    public Sales addSales(Sales sales) {
        // Save the sales
        Sales savedSales = salesRepository.save(sales);

        // Update the inventory for each sales item
        for (SalesItem item : sales.getSaleItems()) {
            // Use the Juice entity to get the fruit usage
            List<FruitUsage> fruitUsages = item.getJuice().getFruitUsages();

            int quantitySold = item.getQuantity();

            // Update the inventory based on the fruit requirements from FruitUsage
            for (FruitUsage fruitUsage : fruitUsages) {
                String fruitName = fruitUsage.getFruitName(); // Assuming getFruitName() returns the name of the fruit
                double requiredQuantityPerJuice = fruitUsage.getQuantityRequired(); // Assuming getQuantity() returns the quantity of that fruit required for one juice

                // Calculate the total amount of fruit needed for this sale
                double totalFruitsNeeded = requiredQuantityPerJuice * quantitySold;

                // Logging the calculation
                System.out.println("Juice: " + item.getJuice().getName() + ", Fruit: " + fruitName +
                        ", Required per Juice: " + requiredQuantityPerJuice + ", Quantity Sold: " + quantitySold +
                        ", Total Fruits Needed: " + totalFruitsNeeded);

                // Update the inventory
                inventoryService.reduceFruitQuantityByName(fruitName, totalFruitsNeeded);
            }
        }

        return savedSales;
    }

    public void deleteSalesById(int id) {
        salesRepository.deleteById(id);
    }
}
