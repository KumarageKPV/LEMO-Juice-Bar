package com.example.mywebapp.service;

import com.example.mywebapp.model.User;
import com.example.mywebapp.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

}
