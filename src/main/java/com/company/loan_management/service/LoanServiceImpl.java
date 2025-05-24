package com.company.loan_management.service;

import com.company.loan_management.exception.LoanNotFoundException;
import com.company.loan_management.model.Loan;
import com.company.loan_management.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service implementation for managing loan metadata.
 * Admins can perform CRUD operations on loan types.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;

    /**
     * Create a new loan type. Prevents duplicates based on loanType.
     *
     * @param loan the loan metadata to create
     * @return the saved Loan
     */
    @Override
    public Loan createLoan(Loan loan) {
        log.info("Attempting to create loan type: {}", loan.getLoanType());
        loanRepository.findByLoanType(loan.getLoanType()).ifPresent(existing -> {
            throw new IllegalArgumentException("Loan type already exists: " + loan.getLoanType());
        });
        Loan saved = loanRepository.save(loan);
        log.info("Loan type created successfully: {}", saved.getLoanType());
        return saved;
    }

    /**
     * Get all available loan types.
     *
     * @return list of all Loan metadata
     */
    @Override
    public List<Loan> getAllLoans() {
        log.info("Fetching all loan types...");
        return loanRepository.findAll();
    }

    /**
     * Get a loan type by its ID.
     *
     * @param id loan ID
     * @return the Loan if found
     */
    @Override
    public Loan getLoanById(Long id) {
        log.info("Fetching loan by ID: {}", id);
        return loanRepository.findById(id)
                .orElseThrow(() -> new LoanNotFoundException("Loan not found with ID: " + id));
    }

    /**
     * Update a loan type by ID.
     *
     * @param id   loan ID
     * @param loan updated loan data
     * @return updated Loan
     */
    @Override
    public Loan updateLoan(Long id, Loan loan) {
        log.info("Updating loan ID {} with new data: {}", id, loan);
        Loan existing = getLoanById(id); // throws LoanNotFoundException

        if (loan.getLoanType() != null) {
            existing.setLoanType(loan.getLoanType());
        }
        if (loan.getMaxAmount() != null) {
            existing.setMaxAmount(loan.getMaxAmount());
        }
        if (loan.getInterestRate() != null) {
            existing.setInterestRate(loan.getInterestRate());
        }
        if (loan.getDurationMonths() != null) {
            existing.setDurationMonths(loan.getDurationMonths());
        }


        Loan updated = loanRepository.save(existing);
        log.info("Loan updated successfully: {}", updated.getLoanType());
        return updated;
    }

    /**
     * Delete a loan type by ID. Throws exception if loan does not exist.
     *
     * @param id loan ID
     */
    @Override
    public void deleteLoan(Long id) {
        log.info("Attempting to delete loan with ID: {}", id);
        Loan existing = getLoanById(id); // throws LoanNotFoundException
        loanRepository.delete(existing);
        log.info("Loan with ID {} deleted successfully", id);
    }

    @Override
    public Optional<Loan> getLoanByType(String loanType) {
        return loanRepository.findByLoanType(loanType);
    }
}
