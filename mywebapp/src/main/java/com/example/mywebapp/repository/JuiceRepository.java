package com.example.mywebapp.repository;

import com.example.mywebapp.model.Juice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JuiceRepository extends JpaRepository<Juice, Long> {
    Juice findByName(String name);

    @Query("SELECT j, SUM(si.quantity) as totalSold " +
            "FROM Juice j " +
            "JOIN SalesItem si ON si.juice.id = j.id " +
            "JOIN Sales s ON si.sales.id = s.id " +
            "GROUP BY j.id " +
            "ORDER BY totalSold DESC")
    List<Object[]> findTopSellingJuices();

    @Query("SELECT j FROM Juice j JOIN FETCH j.fruitUsages")
    List<Juice> findAllWithFruitUsages();

}
