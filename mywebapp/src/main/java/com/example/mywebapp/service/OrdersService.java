package com.example.mywebapp.service;

import com.example.mywebapp.model.OrderStatus;
import com.example.mywebapp.model.Orders;
import com.example.mywebapp.model.Supplier;
import com.example.mywebapp.repository.OrdersRepository;
import com.example.mywebapp.repository.SupplierRepository;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//import java.util.logging.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

@Service
public class OrdersService {
    private static final Logger logger = LoggerFactory.getLogger(OrdersService.class);
    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private SupplierRepository supplierRepository;
    @Autowired
    private InventoryService inventoryService;

    public Orders createOrder(Orders order) {
        logger.info("Received order creation request: {}", order);

        // Extract the supplier ID from the supplier object
        long supplierId = order.getSupplier().getId();
        logger.info("Extracted supplierId: {}", supplierId);

        // Fetch supplier from database
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> {
                    logger.error("Supplier with id {} not found", supplierId);
                    return new RuntimeException("Supplier not found");
                });

        logger.info("Fetched supplier: {}", supplier);

        order.setSupplier(supplier);
        order.setStatus(OrderStatus.PENDING);
        Orders savedOrder = ordersRepository.save(order);
        logger.info("Order saved successfully: {}", savedOrder);

        return savedOrder;
    }


    public Orders updateOrder(long orderId, OrderStatus status) {
        int orderID = (int) orderId;
        Orders orders = ordersRepository.findById((orderID))
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if(status == OrderStatus.CANCELLED) {
            orders.setStatus(OrderStatus.CANCELLED);
            ordersRepository.delete(orders);
            return orders;
        }
        orders.setStatus(status);
        if(status == OrderStatus.RECEIVED) {
            inventoryService.addFruitStock(orders.getProductName(),orders.getQuantity(),"Fruit");
        }
        return ordersRepository.save(orders);
    }

    public List<Orders> getAllOrders() {
        return ordersRepository.findAll();
    }
}
