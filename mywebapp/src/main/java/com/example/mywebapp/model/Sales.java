package com.example.mywebapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales")
public class Sales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonProperty("sale_date")
    private Date saleDate;

    @JsonManagedReference
    @OneToMany(mappedBy = "sales", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SalesItem> saleItems = new ArrayList<>();

    @JsonProperty("payment_method")
    private String paymentMethod;

    @JsonProperty("price")
    private double price;

    public Sales() {
    }

    public Sales(int id, Date saleDate, List<SalesItem> saleItems, String paymentMethod , double price) {
        this.id = id;
        this.saleDate = saleDate;
        this.saleItems = saleItems;
        this.paymentMethod = paymentMethod;
        this.price = price;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getSaleDate() {
        return saleDate;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setSaleDate(Date saleDate) {
        this.saleDate = saleDate;
    }

    public List<SalesItem> getSaleItems() {
        return saleItems;
    }

    public void setSaleItems(List<SalesItem> saleItems) {
        this.saleItems = saleItems;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
