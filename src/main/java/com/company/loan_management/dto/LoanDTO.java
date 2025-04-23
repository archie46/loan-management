package com.company.loan_management.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanDTO {
    private Long id;
    private String loanType;
    private Double maxAmount;
    private Double interestRate;
    private Integer durationMonths;
}