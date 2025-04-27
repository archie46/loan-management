package com.company.loan_management.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

/**
 * Data Transfer Object (DTO) for LoanRequest.
 * Used for transferring loan request data to and from the frontend or API clients.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLoanRequestDTO {

    private Long id;

    @NotNull(message = "Username cannot be null")
    private String username;

    @NotNull(message = "Loan ID cannot be null")
    private String loanType;

    private String status;

    @NotNull(message = "Approved amount cannot be null")
    private Double requestedAmount;

    private String managerRemarks="";


    private ManagerDTO managerDTO; // To Send Manager's details
    private LocalDate requestDate;   // New field for request date
    private LocalDate approvalDate;  // New field for approval date
    private LocalDate rejectionDate; // New field for rejection date
    private LocalDate disbursementDate; // New field for disbursement date
}
