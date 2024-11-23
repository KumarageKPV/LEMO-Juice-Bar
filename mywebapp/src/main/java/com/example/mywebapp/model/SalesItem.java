package com.example.mywebapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class SalesItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "sales_id", nullable = false) // Foreign key to Sales table
    private Sales sales;

    @ManyToOne
    @JoinColumn(name = "juice_id", nullable = false) // Foreign key to Juice table
    private Juice juice; // Juice entity instead of productName

    private int quantity; // Quantity of juice sold

    public SalesItem() {
    }

    public SalesItem(Sales sales, Juice juice, int quantity) {
        this.sales = sales;
        this.juice = juice;
        this.quantity = quantity;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Sales getSales() {
        return sales;
    }

    public void setSales(Sales sales) {
        this.sales = sales;
    }

    public Juice getJuice() {
        return juice;
    }

    public void setJuice(Juice juice) {
        this.juice = juice;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getProductName() {
        return juice.getName();
    }
}
