package com.example.mywebapp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Juice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private double price;

    @OneToMany(mappedBy = "juice" , cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference
    private List<FruitUsage> fruitUsages;
    public Juice() {
    }

    public Juice(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<FruitUsage> getFruitUsages() {
        return fruitUsages;
    }

    public void setFruitUsages(List<FruitUsage> fruitUsages) {
        this.fruitUsages = fruitUsages;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }



}
