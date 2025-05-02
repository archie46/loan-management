package com.company.loan_management.controller;

import com.company.loan_management.dto.LoginRequestDTO;
import com.company.loan_management.dto.LoginResponseDTO;
import com.company.loan_management.jwt.JwtUtil;
import com.company.loan_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    public AuthController(UserService userService, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Authenticates the user and returns a JWT token along with user details if successful.
     *
     * @param loginRequestDTO Object containing the username and password.
     * @return ResponseEntity with status and JWT token if authentication is successful, or error message.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        logger.info("Attempting to authenticate user with username: {}", loginRequestDTO.getUsername());

        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDTO.getUsername(),
                            loginRequestDTO.getPassword()
                    )
            );

            // Generate JWT token
            String token = jwtUtil.generateToken(authentication.getName());
            logger.info("Authentication successful for username: {}", loginRequestDTO.getUsername());

            // Fetch user details
            LoginResponseDTO response = new LoginResponseDTO(token, loginRequestDTO.getUsername());


            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            logger.warn("Invalid credentials for username: {}", loginRequestDTO.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
            logger.error("An error occurred during login for username: {}", loginRequestDTO.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

}


