package com.company.loan_management.service;

import com.company.loan_management.model.LoanRequest;
import com.company.loan_management.repository.LoanRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanRequestServiceImpl implements LoanRequestService {

    private final LoanRequestRepository loanRequestRepository;

    @Override
    public LoanRequest applyForLoan(LoanRequest request) {
        request.setStatus("PENDING");
        return loanRequestRepository.save(request);
    }

    @Override
    public List<LoanRequest> getAllRequests() {
        return loanRequestRepository.findAll();
    }

    @Override
    public List<LoanRequest> getRequestsByUser(Long userId) {
        return loanRequestRepository.findByUserId(userId);
    }

    @Override
    public LoanRequest approveLoan(Long requestId, Double amount, String remarks) {
        LoanRequest request = loanRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("APPROVED");
        request.setApprovedAmount(amount);
        request.setManagerRemarks(remarks);
        return loanRequestRepository.save(request);
    }

    @Override
    public LoanRequest rejectLoan(Long requestId, String remarks) {
        LoanRequest request = loanRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("REJECTED");
        request.setManagerRemarks(remarks);
        return loanRequestRepository.save(request);
    }
}

