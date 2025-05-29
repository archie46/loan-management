package com.company.loan_management.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanRepaymentDTO {
    private Long id;
    private Long loanRequestId; // Linked LoanRequest
    private Double emiAmount;
    private LocalDate repaymentDate;
    private String status; // PAID, PENDING
}