package com.company.loan_management.mapper;

import com.company.loan_management.dto.UserLoanRequestDTO;
import com.company.loan_management.model.LoanRequest;
import org.springframework.beans.factory.annotation.Autowired;

public class UserLoanRequestMapper {

    @Autowired
    private UserMapper userMapper;

    /**
     * Maps a LoanRequest entity to its corresponding UserLoanRequestDTO.
     *
     * @param request The LoanRequest entity to be mapped.
     * @return The corresponding UserLoanRequestDTO object.
     */
    public static UserLoanRequestDTO toDTO(LoanRequest request) {
        if (request == null) {
            return null;  // Prevents NullPointerException
        }



        return UserLoanRequestDTO.builder()
                .id(request.getId())
                .username(request.getUser() != null ? request.getUser().getUsername() : null)  // Handle potential null user
                .loanType(request.getLoan() != null ? request.getLoan().getLoanType() : null)  // Handle potential null loan
                .status(request.getStatus())
                .requestedAmount(request.getRequestedAmount())
                .managerRemarks(request.getManagerRemarks())
                .managerDTO(UserMapper.toManagerDTO(request.getAssignedManager()))
                .requestDate(request.getRequestDate())
                .approvalDate(request.getApprovalDate())
                .rejectionDate(request.getRejectionDate())
                .disbursementDate(request.getDisbursementDate())
                .build();
    }
}
