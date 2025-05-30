package com.company.loan_management.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ManagerDTO {
    private Long id;
    private String name;
    private String email;
    private String department;
}

