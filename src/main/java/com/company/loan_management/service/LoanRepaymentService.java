package com.company.loan_management.service;

import com.company.loan_management.model.LoanRepayment;

import java.util.List;

public interface LoanRepaymentService {
    void generateRepayments(Long loanRequestId); // auto generate monthly schedule
    List<LoanRepayment> getRepaymentsByRequest(Long loanRequestId);
    void markAsPaid(Long repaymentId);
}