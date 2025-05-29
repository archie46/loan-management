package com.company.loan_management.dto;

import com.company.loan_management.model.User;
import lombok.*;

/**
 * Data Transfer Object (DTO) for loan metadata.
 * Used for transferring loan type information between layers.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanDTO {

    /** The ID of the loan type */
    private Long id;

    /** The loan type (e.g., HOME, EDUCATION, CAR) */
    private String loanType;

    /** The maximum amount allowed for the loan type */
    private Double maxAmount;

    /** The interest rate for the loan type */
    private Double interestRate;

    /** The duration (in months) for repayment of the loan */
    private Integer durationMonths;

    private ManagerDTO approverManager;
}
