package com.company.loan_management.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanRequestDTO {
    private Long id;
    private Long userId;
    private Long loanId;
    private String status;
    private Double approvedAmount;
    private String managerRemarks;
}