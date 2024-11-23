package com.example.mywebapp.controller;

import com.example.mywebapp.model.FruitUsage;
import com.example.mywebapp.model.Juice;
import com.example.mywebapp.model.UpdateJuiceRequest;
import com.example.mywebapp.service.JuiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/juice")
public class JuiceController {
    @Autowired
    private JuiceService juiceService;
    @PostMapping("/add")
    public ResponseEntity<Juice> addJuice(@RequestBody Juice juice) {
        Juice savedJuice = juiceService.addJuice(juice);
        return new ResponseEntity<>(savedJuice, HttpStatus.CREATED);
    }

    @DeleteMapping("/{juiceId}")
    public ResponseEntity<String> deleteJuice(@PathVariable long juiceId) {
        try {
            juiceService.deleteJuice(juiceId);
            return ResponseEntity.ok("Juice deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Juice> updateJuice(
            @PathVariable long id,
            @RequestParam double newPrice,
            @RequestBody(required = false) List<FruitUsage> newFruitUsage) {

        Juice updatedJuice = juiceService.updateJuiceDetails(id, newPrice, newFruitUsage);
        return ResponseEntity.ok(updatedJuice);
    }


}
