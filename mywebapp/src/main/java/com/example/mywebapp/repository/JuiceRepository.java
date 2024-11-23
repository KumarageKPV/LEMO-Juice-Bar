package com.example.mywebapp.repository;

import com.example.mywebapp.model.Juice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JuiceRepository extends JpaRepository<Juice, Long> {
    Juice findByName(String name);
}
