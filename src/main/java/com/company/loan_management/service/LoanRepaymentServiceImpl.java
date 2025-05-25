package com.company.loan_management.service;

import com.company.loan_management.exception.LoanRequestNotFoundException;
import com.company.loan_management.exception.RepaymentNotFoundException;
import com.company.loan_management.model.LoanRepayment;
import com.company.loan_management.model.LoanRequest;
import com.company.loan_management.model.User;
import com.company.loan_management.repository.LoanRepaymentRepository;
import com.company.loan_management.repository.LoanRequestRepository;
import com.company.loan_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Service class handling Loan Repayment generation, retrieval and updates.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LoanRepaymentServiceImpl implements LoanRepaymentService {

    private final LoanRepaymentRepository repaymentRepository;
    private final LoanRequestRepository loanRequestRepository;
    private final UserRepository userRepository;

    /**
     * Generates a full EMI repayment schedule for a loan request.
     * @param loanRequestId ID of the loan request
     */
    @Override
    public void generateRepayments(Long loanRequestId) {
        log.info("Generating repayment schedule for Loan Request ID: {}", loanRequestId);

        LoanRequest request = loanRequestRepository.findById(loanRequestId)
                .orElseThrow(() -> new LoanRequestNotFoundException("Loan Request not found with ID: " + loanRequestId));

        double principalAmount = request.getRequestedAmount();
        double annualInterestRate = request.getLoan().getInterestRate();
        int months = request.getLoan().getDurationMonths();

        double monthlyInterestRate = annualInterestRate / 100 / 12;
        double emi = calculateMonthlyRepayment(principalAmount, monthlyInterestRate, months);

        List<LoanRepayment> schedule = new ArrayList<>();
        double remainingBalance = principalAmount;

        for (int i = 1; i <= months; i++) {
            double interestPayment = remainingBalance * monthlyInterestRate;
            double principalPayment = emi - interestPayment;
            remainingBalance -= principalPayment;

            LoanRepayment repayment = LoanRepayment.builder()
                    .loanRequest(request)
                    .emiAmount(emi)
                    .principalPayment(principalPayment)
                    .interestPayment(interestPayment)
                    .remainingBalance(Math.max(remainingBalance, 0)) // Avoid negative balance
                    .repaymentDate(LocalDate.now().plusMonths(i))
                    .status("PENDING")
                    .build();

            schedule.add(repayment);
        }

        repaymentRepository.saveAll(schedule);
        log.info("Repayment schedule generated successfully for Loan Request ID: {}", loanRequestId);

        // Credit loan amount to user's bank account
        User user = request.getUser();
        double newBalance = user.getAccountBalance() + request.getRequestedAmount();
        user.setAccountBalance(newBalance);
        userRepository.save(user);
        log.info("Credited {} to User ID {}. New balance: {}", request.getRequestedAmount(), user.getId(), newBalance);
    }

    /**
     * Retrieves the list of repayments for a given loan request.
     * @param loanRequestId Loan request ID
     * @return List of LoanRepayment entities
     */
    @Override
    public List<LoanRepayment> getRepaymentsByRequest(Long loanRequestId) {
        log.info("Fetching repayments for Loan Request ID: {}", loanRequestId);
        return repaymentRepository.findByLoanRequestId(loanRequestId);
    }

    /**
     * Marks a repayment as paid.
     * @param repaymentId Repayment ID
     */
    @Override
    public void markAsPaid(Long repaymentId) {
        log.info("Marking repayment as PAID for Repayment ID: {}", repaymentId);

        LoanRepayment repayment = repaymentRepository.findById(repaymentId)
                .orElseThrow(() -> new RepaymentNotFoundException("Repayment not found with ID: " + repaymentId));

        repayment.setStatus("PAID");
        repaymentRepository.save(repayment);

        log.info("Repayment marked as PAID successfully for Repayment ID: {}", repaymentId);
    }

    /**
     * Retrieves all repayments for a specific user across all loan requests.
     * @param userId User ID
     * @return List of LoanRepayment entities
     */
    @Override
    public List<LoanRepayment> getRepaymentsByUser(Long userId,String status) {
        log.info("Fetching repayments for User ID: {}", userId);
        if (status == null) {
            return repaymentRepository.findByLoanRequestUserId(userId);
        } else {
            return repaymentRepository.findByLoanRequestUserIdAndStatus(userId, status);
        }
    }

    // Private helper method to calculate EMI
    private double calculateMonthlyRepayment(double principalAmount, double monthlyInterestRate, int months) {
        return principalAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
                (Math.pow(1 + monthlyInterestRate, months) - 1);
    }
}
