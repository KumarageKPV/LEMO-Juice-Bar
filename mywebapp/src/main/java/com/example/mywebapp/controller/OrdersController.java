package com.example.mywebapp.controller;

import com.example.mywebapp.model.OrderStatus;
import com.example.mywebapp.model.Orders;
import com.example.mywebapp.service.OrdersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/orders")
public class OrdersController {
    private static final Logger logger = LoggerFactory.getLogger(OrdersController.class);
    @Autowired
    private OrdersService ordersService;

    @PostMapping
    public Orders createOrder(@RequestBody Orders orders) {
        logger.info("Received JSON request body: {}", orders);
        return ordersService.createOrder(orders);
    }


    @PutMapping("/{orderId}/status")
    public Orders updateOrderStatus(@PathVariable long orderId, @RequestParam OrderStatus status) {
        return ordersService.updateOrder(orderId, status);
    }

    @GetMapping
    public List<Orders> getAllOrders() {
        return ordersService.getAllOrders();
    }

}
