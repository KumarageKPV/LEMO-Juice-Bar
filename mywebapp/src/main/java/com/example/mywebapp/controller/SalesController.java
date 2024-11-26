package com.example.mywebapp.controller;

import com.example.mywebapp.model.Juice;
import com.example.mywebapp.model.SalesItem;
import com.example.mywebapp.model.Sales;
import com.example.mywebapp.service.SalesService;
import com.example.mywebapp.service.InventoryService;
import com.example.mywebapp.service.JuiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/sales")
@CrossOrigin
public class SalesController {

    @Autowired
    private SalesService salesService;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private JuiceService juiceService;

    // Get all sales
    @GetMapping
    public List<Sales> getAll() {
        return salesService.getAllSales();
    }

    // Add sale
    @PostMapping
    public ResponseEntity<Sales> add(@RequestBody Sales sales) {
        // Ensure the sale items have references to the sale
        for (SalesItem item : sales.getSaleItems()) {
            item.setSales(sales); // Set reference to the sale

            // Fetch the Juice from the database to avoid transient instance errors
            Juice juice = juiceService.getJuiceByName(item.getJuice().getName());
            if (juice == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // If juice doesn't exist, return 400 response
            }
            item.setJuice(juice); // Set the managed Juice entity
        }

        // Save the sale and update inventory in the SalesService
        Sales savedSales = salesService.addSales(sales);

        // Return the created sales response
        return new ResponseEntity<>(savedSales, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSaleById(@PathVariable int id) {
        try {
            salesService.deleteSalesById(id);
            return ResponseEntity.ok("Sale deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sale not found");
        }
    }
}
