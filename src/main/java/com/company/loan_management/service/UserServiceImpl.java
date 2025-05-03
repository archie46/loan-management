package com.company.loan_management.service;

import com.company.loan_management.model.Role;
import com.company.loan_management.model.User;
import com.company.loan_management.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    /**
     * Registers a new user by encoding the password and saving the user to the repository.
     *
     * @param user The user object to be registered.
     * @return The saved user object.
     */
    public User createUser(User user) {
        try {
            logger.info("Registering user with username: {}", user.getUsername());
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            User savedUser = userRepository.save(user);
            logger.info("User registered successfully with username: {}", user.getUsername());
            return savedUser;
        } catch (Exception e) {
            logger.error("Error registering user with username: {}", user.getUsername(), e);
            throw e;
        }
    }

    /**
     * Finds a user by their username.
     *
     * @param username The username of the user to be found.
     * @return An Optional containing the user if found, or empty if not.
     */
    public Optional<User> findByUsername(String username) {
        try {
            logger.info("Searching for user with username: {}", username);
            Optional<User> user = userRepository.findByUsername(username);
            if (user.isPresent()) {
                logger.info("User found with username: {}", username);
            } else {
                logger.warn("User not found with username: {}", username);
            }
            return user;
        } catch (Exception e) {
            logger.error("Error searching for user with username: {}", username, e);
            throw e;
        }
    }

    /**
     * Checks if a user with the given username already exists in the repository.
     *
     * @param username The username to check for existence.
     * @return True if the user exists, false otherwise.
     */
    public boolean userExists(String username) {
        try {
            logger.info("Checking if user exists with username: {}", username);
            boolean exists = userRepository.existsByUsername(username);
            if (exists) {
                logger.info("User exists with username: {}", username);
            } else {
                logger.info("User does not exist with username: {}", username);
            }
            return exists;
        } catch (Exception e) {
            logger.error("Error checking if user exists with username: {}", username, e);
            throw e;
        }
    }

    /**
     * Updates an existing user's information.
     *
     * @param id The ID of the user to update.
     * @param updatedUser The new user data.
     * @return The updated user object, or null if not found.
     */
    public User updateUser(Long id, User updatedUser) {
        try {
            logger.info("Updating user with ID: {}", id);
            return userRepository.findById(id).map(existingUser -> {
                existingUser.setName(updatedUser.getName());
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setSalary(updatedUser.getSalary());
                existingUser.setBankAccountNumber(updatedUser.getBankAccountNumber());
                existingUser.setDepartment(updatedUser.getDepartment());
                existingUser.setRole(updatedUser.getRole());
                existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                logger.info("User updated successfully with ID: {}", id);
                return userRepository.save(existingUser);
            }).orElseGet(() -> {
                logger.warn("User with ID: {} not found for update", id);
                return null;
            });
        } catch (Exception e) {
            logger.error("Error updating user with ID: {}", id, e);
            throw e;
        }
    }

    /**
     * Deletes a user by their ID.
     *
     * @param id The ID of the user to delete.
     */
    public void deleteUser(Long id) {
        try {
            if (userRepository.existsById(id)) {
                userRepository.deleteById(id);
                logger.info("Deleted user with ID: {}", id);
            } else {
                logger.warn("User with ID: {} does not exist", id);
            }
        } catch (Exception e) {
            logger.error("Error deleting user with ID: {}", id, e);
            throw e;
        }
    }

    /**
     * Retrieves a list of all users in the system.
     *
     * @return List of all users.
     */
    public List<User> getAllUsers() {
        try {
            logger.info("Retrieving all users");
            return userRepository.findAll();
        } catch (Exception e) {
            logger.error("Error retrieving all users", e);
            throw e;
        }
    }

    /**
     * Finds a user by their ID.
     *
     * @param id The ID of the user to find.
     * @return The user object, or null if not found.
     */
    public User getUserById(Long id) {
        try {
            logger.info("Finding user by ID: {}", id);
            return userRepository.findById(id).orElse(null);
        } catch (Exception e) {
            logger.error("Error finding user by ID: {}", id, e);
            throw e;
        }
    }

    /**
     * Finds users by their role.
     *
     * @param role The role to filter users by.
     * @return List of users with the specified role.
     */
    public List<User> getUsersByRole(Role role) {
        try {
            logger.info("Finding users by role: {}", role);
            return userRepository.findByRole(role);
        } catch (Exception e) {
            logger.error("Error finding users by role: {}", role, e);
            throw e;
        }
    }
}
