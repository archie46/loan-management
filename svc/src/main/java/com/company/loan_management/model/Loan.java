package com.company.loan_management.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String loanType; // e.g., Home, Education, Car

    @Column(nullable = false)
    private Double maxAmount;

    @Column(nullable = false)
    private Double interestRate;

    @ManyToOne
    @JoinColumn(name = "approver_manager_id")
    private User approverManager;

    @Column(nullable = false)
    private Integer durationMonths; // total months for repayment
}