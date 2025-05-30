package com.company.loan_management.controller;

import com.company.loan_management.dto.ManagerApprovalRequestDTO;
import com.company.loan_management.dto.ManagerLoanRequestDTO;
import com.company.loan_management.dto.UserLoanRequestDTO;
import com.company.loan_management.mapper.UserLoanRequestMapper;
import com.company.loan_management.mapper.ManagerLoanRequestMapper;
import com.company.loan_management.model.Loan;
import com.company.loan_management.model.LoanRequest;
import com.company.loan_management.model.User;
import com.company.loan_management.service.LoanRequestService;
import com.company.loan_management.service.LoanService;
import com.company.loan_management.service.UserService;
import com.company.loan_management.exception.LoanNotFoundException;
import com.company.loan_management.exception.UserNotFoundException;
import com.company.loan_management.exception.InvalidLoanRequestException;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

/**
 * Controller to handle Loan Request related operations
 * for Users, Managers, and Finance Department roles.
 */
@RestController
@RequestMapping("/api/loan-requests")
@RequiredArgsConstructor
@Slf4j
public class LoanRequestController {

    private final LoanRequestService loanRequestService;
    private final UserService userService;
    private final LoanService loanService;

    // ------------------ User Endpoints ------------------

    /**
     * User applies for a new loan.
     */
    @Operation(summary = "Apply for a loan", description = "User applies for a loan by providing Details.")
    @PostMapping("/apply")
    public ResponseEntity<UserLoanRequestDTO> applyForLoan(@RequestBody UserLoanRequestDTO loanRequestDto) {
        // Fetch the User and Loan objects using the username and loan type from the request
        Optional<User> user = userService.findByUsername(loanRequestDto.getUsername()); // Fetch user by username
        Optional<Loan> loan = loanService.getLoanByType(loanRequestDto.getLoanType()); // Fetch loan by type

        // Ensure that the user exists
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found with username: " + loanRequestDto.getUsername());
        }

        // Ensure that the loan type exists
        if (loan.isEmpty()) {
            throw new LoanNotFoundException("Loan type not found: " + loanRequestDto.getLoanType());
        }

        // Validate that the requested loan amount is not greater than the maximum allowed amount for this loan type
        if (loanRequestDto.getRequestedAmount() > loan.get().getMaxAmount()) {
            throw new InvalidLoanRequestException("Requested loan amount exceeds the maximum allowed amount.");
        }

        try {
            // Create and process the loan request
            LoanRequest loanRequest = new LoanRequest();
            loanRequest.setUser(user.get());
            loanRequest.setLoan(loan.get());
            loanRequest.setRequestedAmount(loanRequestDto.getRequestedAmount());

            LoanRequest savedLoanRequest = loanRequestService.applyForLoan(user.get().getId(), loanRequest.getLoan(), loanRequestDto.getRequestedAmount());

            // Map the saved entity to the UserLoanRequestDTO
            UserLoanRequestDTO responseDto = UserLoanRequestMapper.toDTO(savedLoanRequest);

            // Return success response with the loan request details
            URI location = URI.create("/api/loan-requests/" + savedLoanRequest.getId());
            return ResponseEntity.created(location).body(responseDto);
        } catch (Exception e) {
            log.error("Error applying for loan: {}", e.getMessage(), e);
            throw new InvalidLoanRequestException("Something went wrong while processing the loan request.");
        }
    }



    /**
     * User cancels a pending loan request.
     */
    @Operation(summary = "Cancel loan request", description = "User cancels their pending loan request.")
    @PostMapping("/cancel")
    public ResponseEntity<UserLoanRequestDTO> cancelLoanRequest(@RequestParam Long requestId, @RequestParam String username) {
        Optional<User> userOpt = userService.findByUsername(username);

        // Check if the user exists before proceeding
        if (userOpt.isPresent()) {
            log.info("User {} attempting to cancel loan request {}", username, requestId);

            try {
                // Proceed to cancel the loan request
                LoanRequest canceledLoanRequest = loanRequestService.cancelLoanRequest(requestId, userOpt.get().getId());

                // Map the canceled LoanRequest to UserLoanRequestDTO
                UserLoanRequestDTO responseDto = UserLoanRequestMapper.toDTO(canceledLoanRequest);

                // Return success response with the canceled loan request details
                return ResponseEntity.ok(responseDto);
            } catch (Exception e) {
                log.error("Error canceling loan request: {}", e.getMessage(), e);
                throw new InvalidLoanRequestException("Something went wrong while canceling the loan request.");
            }
        } else {
            throw new UserNotFoundException("User not found with username: " + username);
        }
    }



    /**
     * User views their loan requests with optional status filtering.
     * The returned loan requests will contain only non-sensitive data like loan type, status, and amounts.
     */
    @Operation(summary = "View user's loan requests", description = "Fetch all loan requests made by the user, with optional filtering by status.")
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserLoanRequestDTO>> getUserLoanRequests(
            @PathVariable Long userId,
            @RequestParam(required = false) String status) {
        log.info("User {} fetching their loan requests, status filter: {}", userId, status);

        // Fetch loan requests by user ID with an optional status filter
        List<LoanRequest> loanRequests = loanRequestService.getLoanRequestsByUser(userId, status);

        // Map loan requests to UserLoanRequestDTO, ensuring no sensitive data is exposed
        // Exposing only username, not sensitive user data

        return ResponseEntity.ok(loanRequests.stream()
                .map(loanRequest -> UserLoanRequestDTO.builder()
                        .id(loanRequest.getId())
                        .username(loanRequest.getUser().getUsername()) // Exposing only username, not sensitive user data
                        .loanType(loanRequest.getLoan().getLoanType())
                        .status(loanRequest.getStatus())
                        .requestedAmount(loanRequest.getRequestedAmount())
                        .build())
                .toList());
    }


    // ------------------ Manager Endpoints ------------------

    /**
     * Manager views assigned loan requests with optional status filtering.
     */
    @Operation(summary = "View manager's assigned loan requests", description = "Fetch all loan requests assigned to manager.")
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<ManagerLoanRequestDTO>> getManagerLoanRequests(
            @PathVariable Long managerId,
            @RequestParam(required = false) String status) {
        log.info("Manager {} fetching assigned loan requests, status filter: {}", managerId, status);
        List<LoanRequest> loanRequests = loanRequestService.getLoanRequestsAssignedToManager(managerId, status);
        // Map LoanRequest entities to ManagerLoanRequestDTOs

        return ResponseEntity.ok(loanRequests.stream()
                .map(ManagerLoanRequestMapper::toDTO)
                .toList());

        
    }

    /**
     * Manager approves a loan request.
     */
    @Operation(summary = "Approve loan request", description = "Manager approves a loan request assigned to them.")
    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/manager/approve")
    public ResponseEntity<String> approveLoanRequest(
            @RequestBody ManagerApprovalRequestDTO approvalRequest) {
        log.info("Manager {} approving loan request {}", approvalRequest.getManagerId(), approvalRequest.getRequestId());
        loanRequestService.approveLoanRequest(
                approvalRequest.getRequestId(),
                approvalRequest.getManagerId(),
                approvalRequest.getApprovedAmount(),
                approvalRequest.getRemarks()
        );
        return ResponseEntity.ok("Loan Approved");
    }

    /**
     * Manager rejects a loan request.
     */
    @Operation(summary = "Reject loan request", description = "Manager rejects a loan request assigned to them.")
    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/manager/reject")
    public ResponseEntity<String> rejectLoanRequest(
            @RequestBody ManagerApprovalRequestDTO rejectionRequest) {
        log.info("Manager {} rejecting loan request {}", rejectionRequest.getManagerId(), rejectionRequest.getRequestId());
        loanRequestService.rejectLoanRequest(
                rejectionRequest.getRequestId(),
                rejectionRequest.getManagerId(),
                rejectionRequest.getRemarks()
        );
        return ResponseEntity.ok("Loan Rejected");
    }
}
