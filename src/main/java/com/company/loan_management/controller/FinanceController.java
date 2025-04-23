package com.company.loan_management.controller;

import com.company.loan_management.dto.LoanRepaymentDTO;
import com.company.loan_management.mapper.LoanRepaymentMapper;
import com.company.loan_management.model.LoanRepayment;
import com.company.loan_management.service.LoanRepaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final LoanRepaymentService loanRepaymentService;

    @PostMapping("/disburse/{loanRequestId}")
    public String disburseLoan(@PathVariable Long loanRequestId) {
        loanRepaymentService.generateRepayments(loanRequestId);
        return "✅ Loan disbursed and repayment schedule generated.";
    }

    @GetMapping("/repayments/{loanRequestId}")
    public List<LoanRepaymentDTO> getRepaymentSchedule(@PathVariable Long loanRequestId) {
        return loanRepaymentService.getRepaymentsByRequest(loanRequestId)
                .stream()
                .map(LoanRepaymentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PutMapping("/repayments/{repaymentId}/mark-paid")
    public String markRepaymentAsPaid(@PathVariable Long repaymentId) {
        loanRepaymentService.markAsPaid(repaymentId);
        return "✅ Repayment marked as PAID.";
    }
}