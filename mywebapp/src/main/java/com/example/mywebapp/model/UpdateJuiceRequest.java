package com.example.mywebapp.model;

import java.util.List;

public class UpdateJuiceRequest {
        private double newPrice;
        private List<FruitUsage> newFruitUsages;

    public UpdateJuiceRequest() {
    }

    public double getNewPrice() {
        return newPrice;
    }

    public void setNewPrice(double newPrice) {
        this.newPrice = newPrice;
    }

    public List<FruitUsage> getNewFruitUsages() {
        return newFruitUsages;
    }

    public void setNewFruitUsages(List<FruitUsage> newFruitUsages) {
        this.newFruitUsages = newFruitUsages;
    }
}
