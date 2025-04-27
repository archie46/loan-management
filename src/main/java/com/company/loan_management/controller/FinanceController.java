package com.company.loan_management.controller;

import com.company.loan_management.dto.LoanRepaymentDTO;
import com.company.loan_management.mapper.LoanRepaymentMapper;
import com.company.loan_management.service.LoanRepaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for Finance Department functionalities like loan disbursement
 * and repayment tracking.
 */
@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Finance Controller", description = "Finance department operations for disbursing loans and managing repayments.")
public class FinanceController {

    private final LoanRepaymentService loanRepaymentService;

    /**
     * Disburses a loan and generates the repayment schedule.
     * @param loanRequestId ID of the loan request
     * @return Success message
     */
    @Operation(summary = "Disburse loan", description = "Disburses an approved loan and generates monthly repayment schedule.")
    @PostMapping("/disburse/{loanRequestId}")
    @PreAuthorize("hasRole('FINANCE')")
    public String disburseLoan(@PathVariable Long loanRequestId) {
        log.info("Disbursing loan and generating schedule for LoanRequestId: {}", loanRequestId);
        loanRepaymentService.generateRepayments(loanRequestId);
        return "✅ Loan disbursed and repayment schedule generated.";
    }

    /**
     * Retrieves the repayment schedule for a specific loan request.
     * @param loanRequestId ID of the loan request
     * @return List of repayment schedule entries
     */
    @Operation(summary = "Get repayment schedule", description = "Retrieves repayment schedule for a particular loan request.")
    @GetMapping("/repayments/{loanRequestId}")
    public List<LoanRepaymentDTO> getRepaymentSchedule(@PathVariable Long loanRequestId) {
        log.info("Fetching repayment schedule for LoanRequestId: {}", loanRequestId);
        return loanRepaymentService.getRepaymentsByRequest(loanRequestId)
                .stream()
                .map(LoanRepaymentMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Marks a specific EMI repayment as paid.
     * @param repaymentId ID of the repayment
     * @return Success message
     */
    @Operation(summary = "Mark repayment as paid", description = "Marks a repayment entry as fully paid.")
    @PutMapping("/repayments/{repaymentId}/mark-paid")
    @PreAuthorize("hasRole('FINANCE')")
    public String markRepaymentAsPaid(@PathVariable Long repaymentId) {
        log.info("Marking repayment as PAID for RepaymentId: {}", repaymentId);
        loanRepaymentService.markAsPaid(repaymentId);
        return "✅ Repayment marked as PAID.";
    }
}
