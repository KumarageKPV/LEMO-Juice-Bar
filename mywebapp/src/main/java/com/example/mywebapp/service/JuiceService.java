package com.example.mywebapp.service;

import com.example.mywebapp.model.FruitUsage;
import com.example.mywebapp.model.Juice;
import com.example.mywebapp.repository.JuiceRepository;
import com.example.mywebapp.repository.FruitUsageRepository; // Import FruitUsageRepository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JuiceService {
    @Autowired
    private JuiceRepository juiceRepository;

    @Autowired
    private FruitUsageRepository fruitUsageRepository; // Inject FruitUsageRepository

    public Juice addJuice(Juice juice) {
        for (FruitUsage usage : juice.getFruitUsages()) {
            usage.setJuice(juice);
        }
        return juiceRepository.save(juice);
    }

    public void deleteJuice(long juiceId) {
        Juice juice = juiceRepository.findById(juiceId)
                .orElseThrow(() -> new RuntimeException("Juice not found"));
        juice.getFruitUsages().clear();
        juiceRepository.save(juice);
        
        juiceRepository.delete(juice);
    }

    public Juice getJuiceByName(String name) {
        return juiceRepository.findByName(name);
    }

    public Juice updateJuiceDetails(long juiceId, double newPrice, List<FruitUsage> newFruitUsages) {
        Juice juice = juiceRepository.findById(juiceId)
                .orElseThrow(() -> new IllegalArgumentException("Juice not found"));

        // Update price
        juice.setPrice(newPrice);

        // Check if newFruitUsages is not null before processing
        if (newFruitUsages != null) {
            List<FruitUsage> currentFruitUsages = juice.getFruitUsages();

            // Add new fruit usages to the juice
            for (FruitUsage newUsage : newFruitUsages) {
                if (!currentFruitUsages.contains(newUsage)) {
                    newUsage.setJuice(juice);
                    currentFruitUsages.add(newUsage);
                }
            }

            // Remove any fruit usages that are no longer referenced
            currentFruitUsages.removeIf(usage -> !newFruitUsages.contains(usage));
        }

        // Save updated juice
        return juiceRepository.save(juice);
    }

    public List<Juice> getAllJuices() {
        return juiceRepository.findAll();
    }

}
