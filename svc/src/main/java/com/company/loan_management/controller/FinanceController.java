package com.company.loan_management.controller;

import com.company.loan_management.dto.LoanRepaymentDTO;
import com.company.loan_management.dto.ManagerLoanRequestDTO;
import com.company.loan_management.mapper.LoanRepaymentMapper;
import com.company.loan_management.mapper.ManagerLoanRequestMapper;
import com.company.loan_management.model.LoanRepayment;
import com.company.loan_management.model.LoanRequest;
import com.company.loan_management.service.LoanRepaymentService;
import com.company.loan_management.service.LoanRequestService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for Finance Department functionalities like loan disbursement
 * and repayment tracking.
 */
@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
@Slf4j
public class FinanceController {

    private final LoanRepaymentService loanRepaymentService;
    private final LoanRequestService loanRequestService;

    /**
     * Disburses a loan and generates the repayment schedule.
     * @param loanRequestId ID of the loan request
     * @return Success message
     */
    @Operation(summary = "Disburse loan", description = "Disburses an approved loan and generates monthly repayment schedule.")
    @PostMapping("/disburse/{loanRequestId}")
    @PreAuthorize("hasRole('FINANCE')")
    public ResponseEntity<String> disburseLoan(@PathVariable Long loanRequestId) {
        log.info("Disbursing loan and generating schedule for LoanRequestId: {}", loanRequestId);
        loanRequestService.disburseLoan(loanRequestId);
        loanRepaymentService.generateRepayments(loanRequestId);
        return ResponseEntity.ok("Loan disbursed and repayment schedule generated.");
    }

    /**
     * Retrieves the repayment schedule for a specific loan request.
     * @param loanRequestId ID of the loan request
     * @return List of repayment schedule entries
     */
    @Operation(summary = "Get repayment schedule", description = "Retrieves repayment schedule for a particular loan request.")
    @GetMapping("/repayments/{loanRequestId}")
    public ResponseEntity<List<LoanRepaymentDTO>> getRepaymentSchedule(@PathVariable Long loanRequestId) {
        log.info("Fetching repayment schedule for LoanRequestId: {}", loanRequestId);
        return ResponseEntity.ok(loanRepaymentService.getRepaymentsByRequest(loanRequestId)
                .stream()
                .map(LoanRepaymentMapper::toDTO)
                .toList());
    }

    /**
     * Marks a specific EMI repayment as paid.
     * @param repaymentId ID of the repayment
     * @return Success message
     */
    @Operation(summary = "Mark repayment as paid", description = "Marks a repayment entry as fully paid.")
    @PutMapping("/repayments/{repaymentId}/mark-paid")
    @PreAuthorize("hasRole('FINANCE')")
    public ResponseEntity<String> markRepaymentAsPaid(@PathVariable Long repaymentId) {
        log.info("Marking repayment as PAID for RepaymentId: {}", repaymentId);
        loanRepaymentService.markAsPaid(repaymentId);
        return ResponseEntity.ok("Repayment marked as PAID.");
    }

    /**
     * Retrieves all approved loan requests that are pending disbursal.
     * Allows optional filtering by loan status.
     *
     * @param status Optional loan status to filter (e.g., APPROVED, DISBURSED)
     * @return List of loan requests eligible for finance department action
     */
    @Operation(summary = "Get loan requests for disbursal",
            description = "Fetches loan requests approved by the manager, optionally filtered by status, for disbursal by the finance department.")
    @GetMapping("/loanRequests")
    public ResponseEntity<List<ManagerLoanRequestDTO>> getLoanRequests(
            @RequestParam(required = false) String status) {
        log.info("Finance Department fetching their loan requests, status filter: {}", status);

        // Fetch loan requests by user ID with an optional status filter
        List<LoanRequest> loanRequests = loanRequestService.getApprovedLoansForDisbursal(status);


        // Map loan requests to UserLoanRequestDTO, ensuring no sensitive data is exposed
        // Exposing only username, not sensitive user data

        return ResponseEntity.ok(loanRequests.stream()
                .map(ManagerLoanRequestMapper::toDTO)
                .toList());
    }


    /**
     * Retrieves loan repayments for a specific user, with optional status filtering.
     *
     * @param userId ID of the user whose repayments are being queried
     * @param status Optional repayment status (e.g., PENDING, PAID)
     * @return List of loan repayment entries associated with the user
     */
    @Operation(summary = "Get loan repayments for user",
            description = "Retrieves all loan repayments for a specific user ID. Can optionally filter by repayment status (e.g., PENDING, PAID).")
    @GetMapping("/loanRepayments")
    public ResponseEntity<List<LoanRepaymentDTO>> getLoanRepayments(@RequestParam(required = true) Long userId,
            @RequestParam(required = false) String status) {
        log.info("User fetching their loan repayments, status filter: {}", status);

        // Fetch loan requests by user ID with an optional status filter
        List<LoanRepayment> loanRepayments = loanRepaymentService.getRepaymentsByUser(userId,status);

        // Map loan requests to UserLoanRequestDTO, ensuring no sensitive data is exposed
        // Exposing only username, not sensitive user data

        return ResponseEntity.ok(loanRepayments.stream()
                .map(LoanRepaymentMapper::toDTO)
                .toList());
    }


}
