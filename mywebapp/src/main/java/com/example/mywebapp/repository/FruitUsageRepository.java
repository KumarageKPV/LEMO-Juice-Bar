package com.example.mywebapp.repository;

import com.example.mywebapp.model.FruitUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FruitUsageRepository extends JpaRepository<FruitUsage, Long> {

}
