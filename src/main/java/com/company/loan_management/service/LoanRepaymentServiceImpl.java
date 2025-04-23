package com.company.loan_management.service;

import com.company.loan_management.model.LoanRepayment;
import com.company.loan_management.model.LoanRequest;
import com.company.loan_management.repository.LoanRepaymentRepository;
import com.company.loan_management.repository.LoanRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanRepaymentServiceImpl implements LoanRepaymentService {

    private final LoanRepaymentRepository repaymentRepository;
    private final LoanRequestRepository loanRequestRepository;

    @Override
    public void generateRepayments(Long loanRequestId) {
        LoanRequest request = loanRequestRepository.findById(loanRequestId)
                .orElseThrow(() -> new RuntimeException("Loan Request not found"));

        double principalAmount = request.getApprovedAmount();
        double annualInterestRate = request.getLoan().getInterestRate();
        int months = request.getLoan().getDurationMonths();

        // Monthly interest rate
        double monthlyInterestRate = annualInterestRate / 100 / 12;

        // Calculate the EMI using the amortization formula
        double emi = calculateMonthlyRepayment(principalAmount, monthlyInterestRate, months);

        // Generate repayment schedule
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
                    .remainingBalance(remainingBalance)
                    .repaymentDate(LocalDate.now().plusMonths(i))
                    .status("PENDING")
                    .build();

            schedule.add(repayment);
        }

        repaymentRepository.saveAll(schedule);
    }

    @Override
    public List<LoanRepayment> getRepaymentsByRequest(Long loanRequestId) {
        return repaymentRepository.findByLoanRequestId(loanRequestId);
    }

    // Method to calculate the EMI using the amortization formula
    private double calculateMonthlyRepayment(double principalAmount, double monthlyInterestRate, int months) {
        return principalAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
                (Math.pow(1 + monthlyInterestRate, months) - 1);
    }

    @Override
    public void markAsPaid(Long repaymentId) {
        LoanRepayment repayment = repaymentRepository.findById(repaymentId)
                .orElseThrow(() -> new RuntimeException("Repayment not found"));

        repayment.setStatus("PAID");
        repaymentRepository.save(repayment);
    }

}
