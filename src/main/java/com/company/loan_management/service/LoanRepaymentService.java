package com.company.loan_management.service;

import com.company.loan_management.model.LoanRepayment;

import java.util.List;

public interface LoanRepaymentService {

    // Generate EMI schedule after loan disbursal
    void generateRepayments(Long loanRequestId);

    // Get repayment schedule for a specific loan
    List<LoanRepayment> getRepaymentsByRequest(Long loanRequestId);

    // Mark an EMI as paid
    void markAsPaid(Long repaymentId);

    // (NEW) Get all repayments for a user across loans
    List<LoanRepayment> getRepaymentsByUser(Long userId,String status);
}
