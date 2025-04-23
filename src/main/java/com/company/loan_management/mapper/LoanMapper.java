package com.company.loan_management.mapper;

import com.company.loan_management.dto.LoanDTO;
import com.company.loan_management.model.Loan;

public class LoanMapper {

    public static LoanDTO toDTO(Loan loan) {
        return LoanDTO.builder()
                .id(loan.getId())
                .loanType(loan.getLoanType())
                .maxAmount(loan.getMaxAmount())
                .interestRate(loan.getInterestRate())
                .durationMonths(loan.getDurationMonths())
                .build();
    }
}