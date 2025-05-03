package com.company.loan_management.service;

import com.company.loan_management.exception.*;
import com.company.loan_management.model.Loan;
import com.company.loan_management.model.LoanRequest;
import com.company.loan_management.model.User;
import com.company.loan_management.repository.LoanRequestRepository;
import com.company.loan_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoanRequestServiceImpl implements LoanRequestService {

    private final LoanRequestRepository loanRequestRepository;
    private final UserRepository userRepository;

    /**
     * User applies for a new loan.
     */
    @Override
    public LoanRequest applyForLoan(Long userId, Loan loan, Double requestedAmount) {
        log.info("User {} applying for {} Loan", userId, loan.getLoanType());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        LoanRequest request = LoanRequest.builder()
                .user(user)
                .loan(loan) // assuming you have Loan entity's constructor with id
                .status("PENDING")
                .assignedManager(loan.getApproverManager())
                .requestedAmount(requestedAmount)
                .build();

        return loanRequestRepository.save(request);
    }

    /**
     * User cancels their pending loan request.
     */
    @Override
    public LoanRequest cancelLoanRequest(Long requestId, Long userId) {
        log.info("User {} attempting to cancel loan request {}", userId, requestId);
        LoanRequest request = loanRequestRepository.findById(requestId)
                .orElseThrow(() -> new LoanRequestNotFoundException("Loan request not found with ID: " + requestId));

        if (!request.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("User is not authorized to cancel this loan request.");
        }

        if (!"PENDING".equals(request.getStatus())) {
            throw new InvalidLoanStatusException("Only pending requests can be canceled.");
        }

        request.setStatus("CANCELED");
        return loanRequestRepository.save(request);
    }

    /**
     * User views/searches their loan requests.
     */
    @Override
    public List<LoanRequest> getLoanRequestsByUser(Long userId, String statusFilter) {
        log.info("Fetching loan requests for user {}, status filter: {}", userId, statusFilter);
        if (statusFilter == null || statusFilter.isEmpty()) {
            return loanRequestRepository.findByUserId(userId);
        }
        return loanRequestRepository.findByUserIdAndStatus(userId, statusFilter);
    }

    /**
     * Manager views/searches assigned loan requests.
     */
    @Override
    public List<LoanRequest> getLoanRequestsAssignedToManager(Long managerId, String statusFilter) {
        log.info("Fetching loan requests assigned to manager {}, status filter: {}", managerId, statusFilter);
        if (statusFilter == null || statusFilter.isEmpty()) {
            return loanRequestRepository.findByAssignedManagerId(managerId);
        }
        return loanRequestRepository.findByAssignedManagerIdAndStatus(managerId, statusFilter);
    }

    /**
     * Manager approves a loan request.
     */
    @Override
    public LoanRequest approveLoanRequest(Long requestId, Long managerId, Double approvedAmount, String managerRemarks) {
        log.info("Manager {} approving loan request {}", managerId, requestId);
        LoanRequest request = loanRequestRepository.findById(requestId)
                .orElseThrow(() -> new LoanRequestNotFoundException("Loan request not found with ID: " + requestId));

        if (!request.getAssignedManager().getId().equals(managerId)) {
            throw new UnauthorizedActionException("Manager not authorized to approve this loan request.");
        }

        request.setStatus("APPROVED");
        request.setRequestedAmount(approvedAmount);
        request.setManagerRemarks(managerRemarks);
        request.setApprovalDate(LocalDate.now());

        return loanRequestRepository.save(request);
    }

    /**
     * Manager rejects a loan request.
     */
    @Override
    public LoanRequest rejectLoanRequest(Long requestId, Long managerId, String managerRemarks) {
        log.info("Manager {} rejecting loan request {}", managerId, requestId);
        LoanRequest request = loanRequestRepository.findById(requestId)
                .orElseThrow(() -> new LoanRequestNotFoundException("Loan request not found with ID: " + requestId));

        if (!request.getAssignedManager().getId().equals(managerId)) {
            throw new UnauthorizedActionException("Manager not authorized to reject this loan request.");
        }

        request.setStatus("REJECTED");
        request.setManagerRemarks(managerRemarks);
        request.setRejectionDate(LocalDate.now());

        return loanRequestRepository.save(request);
    }

    /**
     * Finance department views/searches approved loans ready for disbursal.
     */
    @Override
    public List<LoanRequest> getApprovedLoansForDisbursal(String statusFilter) {
        log.info("Fetching loans ready for disbursal, status filter: {}", statusFilter);
        if (statusFilter == null || statusFilter.isEmpty()) {
            return loanRequestRepository.findByStatus("APPROVED");
        }
        return loanRequestRepository.findByStatus(statusFilter);
    }

    /**
     * Finance department disburses an approved loan.
     */
    @Override
    public LoanRequest disburseLoan(Long requestId) {
        log.info("Disbursing loan request {}", requestId);
        LoanRequest request = loanRequestRepository.findById(requestId)
                .orElseThrow(() -> new LoanRequestNotFoundException("Loan request not found with ID: " + requestId));

        if (!"APPROVED".equals(request.getStatus())) {
            throw new InvalidLoanStatusException("Only approved loans can be disbursed.");
        }

        request.setStatus("DISBURSED");
        // You can also update user's accountBalance here separately in a transaction

        return loanRequestRepository.save(request);
    }
}
