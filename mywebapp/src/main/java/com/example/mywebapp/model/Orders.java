package com.example.mywebapp.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String productName;

    private double quantity;
    
    private LocalDate orderDate;

    @ManyToOne
    @JoinColumn(name = "supplier_id" , nullable = false)
    private Supplier supplier;

    public Orders() {

    }

    public Orders(long id, OrderStatus status, String productName, double quantity, LocalDate orderDate, Supplier supplier) {
        this.id = id;
        this.status = status;
        this.productName = productName;
        this.quantity = quantity;
        this.orderDate = orderDate;
        this.supplier = supplier;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }
}
