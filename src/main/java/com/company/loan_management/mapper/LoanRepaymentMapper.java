package com.company.loan_management.mapper;

import com.company.loan_management.dto.LoanRepaymentDTO;
import com.company.loan_management.model.LoanRepayment;

public class LoanRepaymentMapper {

    public static LoanRepaymentDTO toDTO(LoanRepayment repayment) {
        return LoanRepaymentDTO.builder()
                .id(repayment.getId())
                .loanRequestId(repayment.getLoanRequest().getId())
                .emiAmount(repayment.getEmiAmount())
                .repaymentDate(repayment.getRepaymentDate())
                .status(repayment.getStatus())
                .build();
    }
}