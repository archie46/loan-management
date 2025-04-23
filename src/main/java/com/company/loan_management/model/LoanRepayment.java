package com.company.loan_management.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Entity
@Builder
@NoArgsConstructor  // Lombok will generate a default constructor
public class LoanRepayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "loan_request_id", nullable = false)
    private LoanRequest loanRequest;

    private double emiAmount;
    private double principalPayment;
    private double interestPayment;
    private double remainingBalance;
    private LocalDate repaymentDate;
    private String status;  // "PENDING", "PAID", etc.

    public LoanRepayment(Long id, LoanRequest loanRequest, double emiAmount, double principalPayment,
                         double interestPayment, double remainingBalance, LocalDate repaymentDate, String status) {
        this.id = id;
        this.loanRequest = loanRequest;
        this.emiAmount = emiAmount;
        this.principalPayment = principalPayment;
        this.interestPayment = interestPayment;
        this.remainingBalance = remainingBalance;
        this.repaymentDate = repaymentDate;
        this.status = status;
    }
}
