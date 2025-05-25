package com.company.loan_management.mapper;

import com.company.loan_management.dto.LoanDTO;
import com.company.loan_management.dto.ManagerDTO;
import com.company.loan_management.model.Loan;
import lombok.extern.slf4j.Slf4j;

/**
 * Mapper class to convert between Loan entity and LoanDTO.
 */
@Slf4j
public class LoanMapper {

    private LoanMapper(){}

    /**
     * Converts a Loan entity to a LoanDTO.
     *
     * @param loan the Loan entity to convert
     * @return the corresponding LoanDTO
     */
    public static LoanDTO toDTO(Loan loan) {
        log.info("Mapping Loan entity to LoanDTO: {}", loan);
        return LoanDTO.builder()
                .id(loan.getId())
                .loanType(loan.getLoanType())
                .maxAmount(loan.getMaxAmount())
                .interestRate(loan.getInterestRate())
                .durationMonths(loan.getDurationMonths())
                .approverManager(UserMapper.toManagerDTO(loan.getApproverManager()))
                .build();
    }

    /**
     * Converts a LoanDTO to a Loan entity.
     *
     * @param loanDTO the LoanDTO to convert
     * @return the corresponding Loan entity
     */
    public static Loan toEntity(LoanDTO loanDTO) {
        log.info("Mapping LoanDTO to Loan entity: {}", loanDTO);
        return Loan.builder()
                .id(loanDTO.getId())
                .loanType(loanDTO.getLoanType())
                .maxAmount(loanDTO.getMaxAmount())
                .interestRate(loanDTO.getInterestRate())
                .durationMonths(loanDTO.getDurationMonths())
                .build();
    }
}
