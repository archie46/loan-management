package com.company.loan_management.service;

import com.company.loan_management.model.Loan;
import com.company.loan_management.model.LoanRequest;

import java.util.List;



public interface LoanRequestService {

    // User functionalities

    LoanRequest applyForLoan(Long userId, Loan loan,Double requestedAmount);

    LoanRequest cancelLoanRequest(Long requestId, Long userId);
    List<LoanRequest> getLoanRequestsByUser(Long userId, String statusFilter);

    // Manager functionalities
    List<LoanRequest> getLoanRequestsAssignedToManager(Long managerId, String statusFilter);
    LoanRequest approveLoanRequest(Long requestId, Long managerId, Double approvedAmount, String managerRemarks);
    LoanRequest rejectLoanRequest(Long requestId, Long managerId, String managerRemarks);

    // Finance department functionalities
    List<LoanRequest> getApprovedLoansForDisbursal(String statusFilter);
    LoanRequest disburseLoan(Long requestId);

}
