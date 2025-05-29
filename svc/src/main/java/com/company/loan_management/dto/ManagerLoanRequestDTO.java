package com.company.loan_management.dto;


import lombok.*;

import java.time.LocalDate;

/**
 * DTO for managers to view and act on loan requests, containing user details
 * excluding the password.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ManagerLoanRequestDTO {

    private Long id;

    private String loanType;

    private Double requestedAmount;

    private String status;

    private String managerRemarks;

    private LocalDate requestDate;
    private LocalDate approvalDate;
    private LocalDate rejectionDate;
    private LocalDate disbursementDate;

    private UserDTO userDTO;
}

