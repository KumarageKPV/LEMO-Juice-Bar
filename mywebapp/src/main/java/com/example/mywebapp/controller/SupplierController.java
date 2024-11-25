package com.example.mywebapp.controller;

import com.example.mywebapp.model.Supplier;
import com.example.mywebapp.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/supplier")
@CrossOrigin
public class SupplierController {
    @Autowired
    private SupplierService supplierService;

    @PostMapping
    public ResponseEntity<String> addSupplier(@RequestBody Supplier supplier) {
        supplierService.addSupplier(supplier);
        return ResponseEntity.ok("Supplier added successfully");
    }

    @DeleteMapping
    public ResponseEntity<String> deleteSupplier(@RequestBody Supplier supplier) {
        supplierService.deleteSupplier(supplier.getName());
        return ResponseEntity.ok("Supplier deleted successfully");
    }

    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        supplierService.getAllSuppliers();
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }
}
