package com.company.loan_management.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class LoanRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // User requesting the loan
    private User user;

    @ManyToOne
    @JoinColumn(name = "loan_id", nullable = false) // Loan type requested
    private Loan loan;

    @ManyToOne
    @JoinColumn(name = "manager_id", nullable = false) // Manager who approves/rejects the loan request
    private User assignedManager;

    private String status; // PENDING, APPROVED, REJECTED, DISBURSED

    private Double requestedAmount; // Amount approved for the loan

    private String managerRemarks; // Any remarks from the manager

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDate requestDate; // Date when the loan was requested

    private LocalDate approvalDate; // Date when the loan was approved (null if not approved)

    private LocalDate rejectionDate; // Date when the loan was rejected (null if not rejected)

    private LocalDate disbursementDate; // Date when the loan amount was credited to the user's account (null if not disbursed)

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}