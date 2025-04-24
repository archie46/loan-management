package com.company.loan_management.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private String username;

    public LoginResponse(String token, String username) {
        this.token = token;
        this.username = username;
    }
}