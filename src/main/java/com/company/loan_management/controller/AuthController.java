//package com.company.loan_management.controller;
//
//import com.company.loan_management.jwt.JwtUtil;
//import lombok.*;
//import org.jetbrains.annotations.NotNull;
//import org.springframework.security.authentication.*;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/auth")
//@RequiredArgsConstructor
//public class AuthController {
//
//    private final AuthenticationManager authenticationManager;
//    private final JwtUtil jwtUtil;
//
//    @PostMapping("/login")
//    public String login(@RequestBody @NotNull AuthRequest request) {
//        try {
//            // Authenticate the user
//            authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
//            // Generate and return the token if authentication is successful
//            return jwtUtil.generateToken(request.getUsername());
//        } catch (AuthenticationException e) {
//            // Handle authentication failure
//            throw new RuntimeException("Invalid username or password", e);
//        }
//    }
//
//    @Data
//    static class AuthRequest {
//        private String username;
//        private String password;
//    }
//}

package com.company.loan_management.controller;

import com.company.loan_management.jwt.JwtUtil;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public String login(@RequestBody @NotNull AuthRequest request) {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
            // Generate and return the token if authentication is successful
            return jwtUtil.generateToken(request.getUsername());
        } catch (BadCredentialsException e) {
            // Handle authentication failure
            throw new RuntimeException("Invalid username or password", e);
        } catch (AuthenticationException e) {
            throw new RuntimeException("Authentication failed", e);
        }
    }

    @Data
    static class AuthRequest {
        private String username;
        private String password;
    }
}

