package com.example.mywebapp.repository;

import com.example.mywebapp.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Inventory findByFruitName(String fruitName);
}
