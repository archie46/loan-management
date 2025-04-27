package com.company.loan_management.service;

import com.company.loan_management.model.Loan;

import java.util.List;
import java.util.Optional;

public interface LoanService {
    Loan createLoan(Loan loan);
    List<Loan> getAllLoans();
    Loan getLoanById(Long id);
    Loan updateLoan(Long id, Loan loan);
    void deleteLoan(Long id);
    Optional<Loan> getLoanByType(String loanType);
}

