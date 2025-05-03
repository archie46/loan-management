package com.company.loan_management.controller;

import com.company.loan_management.dto.UserDTO;
import com.company.loan_management.exception.DuplicateUsernameException;
import com.company.loan_management.exception.InvalidRoleException;
import com.company.loan_management.exception.UserNotFoundException;
import com.company.loan_management.mapper.UserMapper;
import com.company.loan_management.model.Role;
import com.company.loan_management.model.User;
import com.company.loan_management.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller for managing User-related administrative operations.
 * Only accessible to users with ADMIN role.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * Create a new user (Admin functionality).
     *
     * @param user User entity from request body
     * @return The saved UserDTO
     */
    @PostMapping
    @Operation(summary = "Create a new user (Admin only)")
    public UserDTO createUser(@RequestBody User user) {
        log.info("Creating new user: {}", user.getUsername());

        if (userService.findByUsername(user.getUsername()).isPresent()) {
            throw new DuplicateUsernameException("Username already exists: " + user.getUsername());
        }

        User savedUser = userService.createUser(user);
        return UserMapper.toDTO(savedUser);
    }

    /**
     * Get all users (Admin functionality).
     *
     * @return List of all UserDTOs
     */
    @GetMapping
    @Operation(summary = "Get all users (Admin only)")
    public List<UserDTO> getAllUsers() {
        log.info("Fetching all users");
        return userService.getAllUsers()
                .stream()
                .map(UserMapper::toDTO)
                .toList();
    }

    /**
     * Get user by ID.
     *
     * @param id ID of the user
     * @return The UserDTO of the found user
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get user details by ID (Admin only)")
    public UserDTO getUser(@PathVariable Long id) {
        log.info("Fetching user with ID: {}", id);

        User user = userService.getUserById(id);
        if (user == null) {
            throw new UserNotFoundException("User with ID " + id + " not found");
        }

        return UserMapper.toDTO(user);
    }

    /**
     * Update an existing user (Admin functionality).
     *
     * @param id ID of the user to update
     * @param user User object with updated data
     * @return Updated UserDTO
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update user information (Admin only)")
    public UserDTO updateUser(@PathVariable Long id, @RequestBody User user) {
        log.info("Updating user with ID: {}", id);

        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            throw new UserNotFoundException("Cannot update. User with ID " + id + " not found");
        }

        User updatedUser = userService.updateUser(id, user);
        return UserMapper.toDTO(updatedUser);
    }

    /**
     * Delete a user by ID (Admin functionality).
     *
     * @param id ID of the user to delete
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user by ID (Admin only)")
    public void deleteUser(@PathVariable Long id) {
        log.warn("Deleting user with ID: {}", id);

        User user = userService.getUserById(id);
        if (user == null) {
            throw new UserNotFoundException("Cannot delete. User with ID " + id + " not found");
        }

        userService.deleteUser(id);
    }

    /**
     * Get users filtered by role.
     *
     * @param role The role to filter users by (e.g., ADMIN, EMPLOYEE)
     * @return List of UserDTOs with the specified role
     */
    @GetMapping("/role/{role}")
    @Operation(summary = "Get users by role (Admin only)")
    public List<UserDTO> getUsersByRole(@PathVariable String role) {
        log.info("Fetching users by role: {}", role);
        try {
            Role parsedRole = Role.valueOf(role.toUpperCase());
            return userService.getUsersByRole(parsedRole)
                    .stream()
                    .map(UserMapper::toDTO)
                    .toList();
        } catch (IllegalArgumentException ex) {
            throw new InvalidRoleException("Invalid role: " + role);
        }
    }

    /**
     * API to fetch the currently logged-in user's profile details.
     *
     * @param authentication Spring Security Authentication object (auto-injected).
     * @return User details if found, otherwise HTTP 404.
     */
    @Operation(summary = "Get My User Details", description = "Fetches the profile details of the currently logged-in user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user details"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/me")
    public ResponseEntity<User> getMyDetails(Authentication authentication) {
        String username = authentication.getName(); // Get the username of the logged-in user
        log.info("Fetching profile for logged-in user: {}", username);

        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new UserNotFoundException("User with username '" + username + "' not found"));
    }
}
