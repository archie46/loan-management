package com.company.loan_management.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoanRepayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "loan_request_id", nullable = false)
    private LoanRequest loanRequest;

    @Column(nullable = false)
    private double emiAmount;

    private double principalPayment;

    private double interestPayment;

    private double remainingBalance;

    @Column(nullable = false)
    private LocalDate repaymentDate;  // Expected payment date

    @Column(nullable = false)
    private String status = "PENDING";  // "PENDING" by default

    private LocalDate paymentDate; // (Optional) Date when actually paid

    private String paymentMode; // (Optional) Mode of payment
}

