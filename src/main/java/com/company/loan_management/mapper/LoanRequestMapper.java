package com.company.loan_management.mapper;

import com.company.loan_management.dto.LoanRequestDTO;
import com.company.loan_management.model.LoanRequest;

public class LoanRequestMapper {

    public static LoanRequestDTO toDTO(LoanRequest request) {
        return LoanRequestDTO.builder()
                .id(request.getId())
                .userId(request.getUser().getId())
                .loanId(request.getLoan().getId())
                .status(request.getStatus())
                .approvedAmount(request.getApprovedAmount())
                .managerRemarks(request.getManagerRemarks())
                .build();
    }
}