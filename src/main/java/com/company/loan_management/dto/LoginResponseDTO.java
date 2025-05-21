package com.company.loan_management.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LoginResponseDTO {
    private String token;
    private Long id;
    private String username;
    private List<String> roles;

    public LoginResponseDTO(String token,Long id, String username, List<String> roles) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.roles = roles;
    }
}