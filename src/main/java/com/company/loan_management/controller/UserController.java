package com.company.loan_management.controller;

import com.company.loan_management.dto.UserDTO;
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
import java.util.stream.Collectors;

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
                .collect(Collectors.toList());
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
        return userService.getUsersByRole(Role.valueOf(role))
                .stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
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

        Optional<User> user = userService.findByUsername(username);

        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
