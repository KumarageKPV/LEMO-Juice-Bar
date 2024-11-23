package com.example.mywebapp.service;

import com.example.mywebapp.model.Inventory;
import com.example.mywebapp.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {
    private InventoryRepository inventoryRepository;
    private SmsService smsService;

    public InventoryService(InventoryRepository inventoryRepository,SmsService smsService) {
        this.inventoryRepository = inventoryRepository;
        this.smsService = smsService;
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public void addFruitStock(String fruitName , double quantity){
        Inventory inventory = inventoryRepository.findByFruitName(fruitName);
        if(inventory == null){
            inventory = new Inventory(fruitName, quantity);
            inventoryRepository.save(inventory);
        }else {
            inventory.setQuantity(inventory.getQuantity()+quantity);
            inventoryRepository.save(inventory);
        }
    }

    public void deleteFruitStock(String fruitName){
        Inventory inventory = inventoryRepository.findByFruitName(fruitName);
        if(inventory != null){
            inventoryRepository.delete(inventory);
        }else {
            throw new IllegalArgumentException("Fruit not found");
        }
    }


    public void reduceFruitQuantityByName(String fruitName, double quantity) {
        System.out.println("Reducing "+fruitName+" by "+quantity+" quantity");
        Inventory inventory = inventoryRepository.findByFruitName(fruitName);

        if(inventory != null && inventory.getQuantity() >= quantity) {
            inventory.setQuantity(inventory.getQuantity() - quantity);
            inventoryRepository.save(inventory);
        }else {
            throw new IllegalArgumentException("Not enough fruit to reduce quantity" + fruitName);
        }
        if (inventory.getQuantity() < 1.0) {
            System.out.println("Warning: Stock of " + fruitName + " is below 1 kg. Current stock: "
                    + inventory.getQuantity() + " kg.");
            smsService.sendSms("+94760254406","Low Stock for "+fruitName);

        }
    }
}
