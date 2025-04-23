package com.company.loan_management.controller;

import com.company.loan_management.dto.LoanDTO;
import com.company.loan_management.mapper.LoanMapper;
import com.company.loan_management.model.Loan;
import com.company.loan_management.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping
    public LoanDTO createLoan(@RequestBody Loan loan) {
        Loan savedLoan = loanService.createLoan(loan);
        return LoanMapper.toDTO(savedLoan);
    }

    @GetMapping
    public List<LoanDTO> getAllLoans() {
        return loanService.getAllLoans()
                .stream()
                .map(LoanMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public LoanDTO getLoan(@PathVariable Long id) {
        Loan loan = loanService.getLoanById(id);
        return LoanMapper.toDTO(loan);
    }

    @PutMapping("/{id}")
    public LoanDTO updateLoan(@PathVariable Long id, @RequestBody Loan loan) {
        Loan updatedLoan = loanService.updateLoan(id, loan);
        return LoanMapper.toDTO(updatedLoan);
    }

    @DeleteMapping("/{id}")
    public void deleteLoan(@PathVariable Long id) {
        loanService.deleteLoan(id);
    }
}