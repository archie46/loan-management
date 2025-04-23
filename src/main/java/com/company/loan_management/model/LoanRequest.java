package com.company.loan_management.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Loan loan;

    private String status; // PENDING, APPROVED, REJECTED, DISBURSED

    private Double approvedAmount;

    private String managerRemarks;
}