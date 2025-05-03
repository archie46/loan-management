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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Loan request created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    @PostMapping("/apply")
    public ResponseEntity<UserLoanRequestDTO> applyForLoan(@RequestBody UserLoanRequestDTO loanRequestDto) {
        // Fetch the User and Loan objects using the username and loan type from the request
        Optional<User> user = userService.findByUsername(loanRequestDto.getUsername()); // Fetch user by username
        Optional<Loan> loan = loanService.getLoanByType(loanRequestDto.getLoanType()); // Fetch loan by type

        // Ensure that the user exists
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        // Ensure that the loan type exists
        if (loan.isEmpty()) {
            throw new RuntimeException("Loan type not found");
        }

        // Create a new LoanRequest entity and set its fields
        LoanRequest loanRequest = new LoanRequest();
        loanRequest.setUser(user.get());
        loanRequest.setLoan(loan.get());
        loanRequest.setRequestedAmount(loanRequestDto.getRequestedAmount());

        log.info("User {} applying for {} Loan", user.get().getUsername(), loan.get().getLoanType());

        // Validate that the requested loan amount is not greater than the maximum allowed amount for this loan type
        if (loanRequest.getRequestedAmount() > loan.get().getMaxAmount()) {
            throw new RuntimeException("Requested loan amount exceeds the maximum allowed amount for this loan type");
        }

        try {
            // Process the loan request
            LoanRequest savedLoanRequest = loanRequestService.applyForLoan(user.get().getId(), loanRequest.getLoan(),loanRequestDto.getRequestedAmount());

            // Map the saved entity to the UserLoanRequestDTO
            UserLoanRequestDTO responseDto = UserLoanRequestMapper.toDTO(savedLoanRequest);

            // Return success response with the loan request details
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            throw new RuntimeException("Something Went Wrong");
        }
    }



    /**
     * User cancels a pending loan request.
     */
    @Operation(summary = "Cancel loan request", description = "User cancels their pending loan request.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Loan request canceled successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or unauthorized cancellation")
    })
    @PostMapping("/cancel")
    public ResponseEntity<UserLoanRequestDTO> cancelLoanRequest(@RequestParam Long requestId, @RequestParam String username) {
        Optional<User> userOpt = userService.findByUsername(username);

        // Check if the user exists before proceeding
        if (userOpt.isPresent()) {
            log.info("User {} attempting to cancel loan request {}", userOpt.get().getId(), requestId);

            try {
                // Proceed to cancel the loan request
                LoanRequest canceledLoanRequest = loanRequestService.cancelLoanRequest(requestId, userOpt.get().getId());

                // Map the canceled LoanRequest to UserLoanRequestDTO
                UserLoanRequestDTO responseDto = UserLoanRequestMapper.toDTO(canceledLoanRequest);

                // Return success response with the canceled loan request details
                return ResponseEntity.ok(responseDto);
            } catch (Exception e) {
                throw new RuntimeException("Something Went Wrong");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }



    /**
     * User views their loan requests with optional status filtering.
     * The returned loan requests will contain only non-sensitive data like loan type, status, and amounts.
     */
    @Operation(summary = "View user's loan requests", description = "Fetch all loan requests made by the user, with optional filtering by status.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Loan requests fetched successfully")
    })
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user/{userId}")
    public List<UserLoanRequestDTO> getUserLoanRequests(
            @PathVariable Long userId,
            @RequestParam(required = false) String status) {
        log.info("User {} fetching their loan requests, status filter: {}", userId, status);

        // Fetch loan requests by user ID with an optional status filter
        List<LoanRequest> loanRequests = loanRequestService.getLoanRequestsByUser(userId, status);

        // Map loan requests to UserLoanRequestDTO, ensuring no sensitive data is exposed
        // Exposing only username, not sensitive user data

        return loanRequests.stream()
                .map(loanRequest -> UserLoanRequestDTO.builder()
                        .id(loanRequest.getId())
                        .username(loanRequest.getUser().getUsername()) // Exposing only username, not sensitive user data
                        .loanType(loanRequest.getLoan().getLoanType())
                        .status(loanRequest.getStatus())
                        .requestedAmount(loanRequest.getRequestedAmount())
                        .build())
                .collect(Collectors.toList());
    }


    // ------------------ Manager Endpoints ------------------

    /**
     * Manager views assigned loan requests with optional status filtering.
     */
    @Operation(summary = "View manager's assigned loan requests", description = "Fetch all loan requests assigned to manager.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Assigned loan requests fetched successfully")
    })
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/manager/{managerId}")
    public List<ManagerLoanRequestDTO> getManagerLoanRequests(
            @PathVariable Long managerId,
            @RequestParam(required = false) String status) {
        log.info("Manager {} fetching assigned loan requests, status filter: {}", managerId, status);
        List<LoanRequest> loanRequests = loanRequestService.getLoanRequestsAssignedToManager(managerId, status);
        // Map LoanRequest entities to ManagerLoanRequestDTOs

        return loanRequests.stream()
                .map(ManagerLoanRequestMapper::toDTO)
                .toList();

        
    }

    /**
     * Manager approves a loan request.
     */
    @Operation(summary = "Approve loan request", description = "Manager approves a loan request assigned to them.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Loan request approved successfully"),
            @ApiResponse(responseCode = "400", description = "Unauthorized or invalid operation")
    })
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
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Loan request rejected successfully"),
            @ApiResponse(responseCode = "400", description = "Unauthorized or invalid operation")
    })
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
