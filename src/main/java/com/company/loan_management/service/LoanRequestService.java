package com.company.loan_management.service;

import com.company.loan_management.model.LoanRequest;

import java.util.List;

public interface LoanRequestService {
    LoanRequest applyForLoan(LoanRequest request);
    List<LoanRequest> getAllRequests();
    List<LoanRequest> getRequestsByUser(Long userId);
    LoanRequest approveLoan(Long requestId, Double amount, String remarks);
    LoanRequest rejectLoan(Long requestId, String remarks);
}