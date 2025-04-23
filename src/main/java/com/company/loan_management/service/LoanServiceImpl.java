package com.company.loan_management.service;

import com.company.loan_management.model.Loan;
import com.company.loan_management.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;

    @Override
    public Loan createLoan(Loan loan) {
        return loanRepository.save(loan);
    }

    @Override
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @Override
    public Loan getLoanById(Long id) {
        return loanRepository.findById(id).orElseThrow(() -> new RuntimeException("Loan not found"));
    }

    @Override
    public Loan updateLoan(Long id, Loan loan) {
        Loan existing = getLoanById(id);
        existing.setLoanType(loan.getLoanType());
        existing.setMaxAmount(loan.getMaxAmount());
        existing.setInterestRate(loan.getInterestRate());
        existing.setDurationMonths(loan.getDurationMonths());
        return loanRepository.save(existing);
    }

    @Override
    public void deleteLoan(Long id) {
        loanRepository.deleteById(id);
    }
}

