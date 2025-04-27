package com.company.loan_management.service;

import com.company.loan_management.model.Role;
import com.company.loan_management.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    List<User> getAllUsers();
    User getUserById(Long id);
    User updateUser(Long id, User user);
    void deleteUser(Long id);
    List<User> getUsersByRole(Role role);
    Optional<User> findByUsername(String username);
}

