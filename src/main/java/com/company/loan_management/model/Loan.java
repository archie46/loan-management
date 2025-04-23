package com.company.loan_management.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String loanType; // e.g., Home, Education, Car

    private Double maxAmount;

    private Double interestRate;

    private Integer durationMonths; // total months for repayment
}