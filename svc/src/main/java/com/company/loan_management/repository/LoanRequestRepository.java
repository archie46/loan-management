package com.company.loan_management.repository;

import com.company.loan_management.model.LoanRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRequestRepository extends JpaRepository<LoanRequest, Long> {
    List<LoanRequest> findByUserId(Long userId);
    List<LoanRequest> findByStatus(String status);

    List<LoanRequest> findByUserIdAndStatus(Long userId, String statusFilter);

    List<LoanRequest> findByAssignedManagerId(Long managerId);

    List<LoanRequest> findByAssignedManagerIdAndStatus(Long managerId, String statusFilter);
}