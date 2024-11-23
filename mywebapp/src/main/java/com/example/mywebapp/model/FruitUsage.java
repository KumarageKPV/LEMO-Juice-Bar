package com.example.mywebapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class FruitUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String fruitName;
    private double quantityRequired;

    @ManyToOne
    @JoinColumn(name = "juice_id",nullable = false)
    @JsonBackReference
    private Juice juice;

    public FruitUsage(Long id, String fruitName, double quantityRequired, Juice juice) {
        this.id = id;
        this.fruitName = fruitName;
        this.quantityRequired = quantityRequired;
        this.juice = juice;
    }

    public FruitUsage() {

    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getFruitName() {
        return fruitName;
    }
    public void setFruitName(String fruitName) {
        this.fruitName = fruitName;
    }
    public double getQuantityRequired() {
        return quantityRequired;
    }
    public void setQuantityRequired(double quantityRequired) {
        this.quantityRequired = quantityRequired;
    }
    public Juice getJuice() {
        return juice;
    }
    public void setJuice(Juice juice) {
        this.juice = juice;
    }

}
