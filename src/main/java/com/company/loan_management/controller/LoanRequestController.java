package com.company.loan_management.controller;

import com.company.loan_management.dto.LoanRequestDTO;
import com.company.loan_management.mapper.LoanRequestMapper;
import com.company.loan_management.model.LoanRequest;
import com.company.loan_management.service.LoanRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/loan-requests")
@RequiredArgsConstructor
public class LoanRequestController {

    private final LoanRequestService loanRequestService;

    @PostMapping
    public LoanRequestDTO applyForLoan(@RequestBody LoanRequest request) {
        LoanRequest saved = loanRequestService.applyForLoan(request);
        return LoanRequestMapper.toDTO(saved);
    }

    @GetMapping
    public List<LoanRequestDTO> getAllRequests() {
        return loanRequestService.getAllRequests()
                .stream()
                .map(LoanRequestMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}")
    public List<LoanRequestDTO> getRequestsByUser(@PathVariable Long userId) {
        return loanRequestService.getRequestsByUser(userId)
                .stream()
                .map(LoanRequestMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/approve")
    public LoanRequestDTO approveLoan(@PathVariable Long id,
                                      @RequestParam Double amount,
                                      @RequestParam String remarks) {
        LoanRequest approved = loanRequestService.approveLoan(id, amount, remarks);
        return LoanRequestMapper.toDTO(approved);
    }

    @PutMapping("/{id}/reject")
    public LoanRequestDTO rejectLoan(@PathVariable Long id,
                                     @RequestParam String remarks) {
        LoanRequest rejected = loanRequestService.rejectLoan(id, remarks);
        return LoanRequestMapper.toDTO(rejected);
    }
}