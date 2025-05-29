package com.company.loan_management.controller;

import com.company.loan_management.dto.LoginRequestDTO;
import com.company.loan_management.dto.LoginResponseDTO;
import com.company.loan_management.jwt.JwtUtil;
import com.company.loan_management.service.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
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
    public ResponseEntity<Object> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        logger.info("Attempting to authenticate user with username: {}", loginRequestDTO.getUsername());

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

        // Extract roles from the authenticated principal
        List<String> roles = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        // Fetch user details

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        LoginResponseDTO response = new LoginResponseDTO(token,userDetails.getUser().getId(), loginRequestDTO.getUsername(),roles);

        return ResponseEntity.ok(response);
    }

}
