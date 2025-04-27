package com.company.loan_management.mapper;


import com.company.loan_management.dto.ManagerLoanRequestDTO;
import com.company.loan_management.model.LoanRequest;
import org.springframework.beans.factory.annotation.Autowired;

public class ManagerLoanRequestMapper {

    @Autowired
    private UserMapper userMapper;

    /**
     * Maps a LoanRequest entity to its corresponding ManagerLoanRequestDTO.
     *
     * @param loanRequest The LoanRequest entity to be mapped.
     * @return The corresponding UserLoanRequestDTO object.
     */
    public static ManagerLoanRequestDTO toDTO(LoanRequest loanRequest) {
        if (loanRequest == null) {
            return null;
        }

        return ManagerLoanRequestDTO.builder()
                .id(loanRequest.getId())
                .loanType(loanRequest.getLoan().getLoanType())
                .requestedAmount(loanRequest.getRequestedAmount())
                .status(loanRequest.getStatus())
                .managerRemarks(loanRequest.getManagerRemarks())
                .requestDate(loanRequest.getRequestDate())
                .approvalDate(loanRequest.getApprovalDate())
                .rejectionDate(loanRequest.getRejectionDate())
                .disbursementDate(loanRequest.getDisbursementDate())
                .userDTO(UserMapper.toDTO(loanRequest.getUser()))
                .build();
    }

}
