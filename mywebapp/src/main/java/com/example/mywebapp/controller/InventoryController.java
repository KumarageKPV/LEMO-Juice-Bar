package com.example.mywebapp.controller;

import com.example.mywebapp.model.Inventory;
import com.example.mywebapp.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/inventory")
@CrossOrigin
public class InventoryController {
    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public List<Inventory> getInventory() {
        return inventoryService.getAllInventory();
    }

    @PostMapping("/add")
    public ResponseEntity<String> addInventory(@RequestBody Inventory inventory) {
        try {
            inventoryService.addFruitStock(inventory.getFruitName(), inventory.getQuantity());
            return ResponseEntity.ok("Added fruit " + inventory.getFruitName());
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteInventory(@RequestBody Inventory inventory) {
        try {
            inventoryService.deleteFruitStock(inventory.getFruitName());
            return ResponseEntity.ok("Deleted fruit " + inventory.getFruitName());
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
