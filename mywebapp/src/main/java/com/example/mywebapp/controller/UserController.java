package com.example.mywebapp.controller;

import com.example.mywebapp.model.User;
import com.example.mywebapp.repository.UserRepository;
import com.example.mywebapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("api/users")
public class UserController {
    private final UserRepository userRepository;
    private UserService userService;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody User user) {
        try {
            if(userRepository.findByUsername(user.getUsername()) != null) {
                throw new Exception("Username already exists");
            }
            userService.createAccount(user);
            return ResponseEntity.ok("Account created");

        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            String role = userService.login(user);
            return ResponseEntity.ok(role);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/password")
    public ResponseEntity<String> updatePassword(@RequestBody User user ) {
        try {
            String response = userService.updatePassword(user.getUsername(), user.getPassword());
            return ResponseEntity.ok(response);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<String> deleteUser(@RequestBody User user) {
        try {
            String response = userService.deleteAccount(user.getUsername());
            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }
}
