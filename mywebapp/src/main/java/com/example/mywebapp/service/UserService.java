package com.example.mywebapp.service;

import com.example.mywebapp.model.User;
import com.example.mywebapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public void createAccount(User user) {
        userRepository.save(user);
    }

    public String login(User user) {
        String username = user.getUsername();
        String password = user.getPassword();
        User storedUser = userRepository.findByUsername(username);
        if (storedUser == null) {
            throw new IllegalArgumentException("Username not found");
        } else if (!storedUser.getPassword().equals(password)) {
            throw new IllegalArgumentException("Invalid password");
        }
        return storedUser.getRole();
    }

    public String updatePassword(String username, String newPassword) {
        // Find the user by their username
        User storedUser = userRepository.findByUsername(username);

        if (storedUser == null) {
            throw new IllegalArgumentException("User not found");
        }

        // Update the password
        storedUser.setPassword(newPassword);

        // Save the updated user information
        userRepository.save(storedUser);

        return "Password updated successfully";
    }

    public String deleteAccount(String username) {
        User storedUser = userRepository.findByUsername(username);
        if (storedUser == null) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.delete(storedUser);
        return "User deleted successfully";
    }

}
