package com.example.mywebapp.service;

import com.example.mywebapp.model.Supplier;
import com.example.mywebapp.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {
    private SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public void addSupplier(Supplier supplier) {
        supplierRepository.save(supplier);

    }
    public void deleteSupplier(String name) {
        Supplier supplier = supplierRepository.findByName(name);
        if (supplier != null) {
            supplierRepository.delete(supplier);
        }
        else {
            throw new RuntimeException("Supplier not found");
        }
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier updateSupplier(long supplierId , Supplier updatedSupplier) {
        Supplier existingSupplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        existingSupplier.setName(updatedSupplier.getName());
        existingSupplier.setEmail(updatedSupplier.getEmail());
        existingSupplier.setPhone(updatedSupplier.getPhone());
        return supplierRepository.save(existingSupplier);
    }

}

