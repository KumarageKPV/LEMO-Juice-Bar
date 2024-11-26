package com.example.mywebapp.repository;

import com.example.mywebapp.model.Sales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface SalesRepository extends JpaRepository<Sales, Integer> {
    @Query("SELECT s FROM Sales s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    List<Sales> findSalesByDateRange(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);
}