package com.company.loan_management.controller;

import com.company.loan_management.dto.LoanDTO;
import com.company.loan_management.mapper.LoanMapper;
import com.company.loan_management.model.Loan;
import com.company.loan_management.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller for managing loan metadata. Admin can perform CRUD operations.
 */
@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@Slf4j
public class LoanController {

    private final LoanService loanService;

    /**
     * Create a new loan type.
     *
     * @param loan the loan data to create
     * @return the created loan data (LoanDTO)
     */
    @Operation(summary = "Create a new loan type",
            description = "This API allows you to create a new loan type with details like loan type, amount, and duration.",
            responses = {
                    @ApiResponse(description = "Loan created successfully", responseCode = "201",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = LoanDTO.class))),
                    @ApiResponse(description = "Invalid input data", responseCode = "400")
            })
    @PostMapping
    public LoanDTO createLoan(@Valid @RequestBody Loan loan) {
        log.info("Creating loan type: {}", loan.getLoanType());
        Loan savedLoan = loanService.createLoan(loan);
        log.info("Loan type created successfully: {}", savedLoan.getLoanType());
        return LoanMapper.toDTO(savedLoan);
    }

    /**
     * Get all loan types.
     *
     * @return list of all loan types (LoanDTO)
     */
    @Operation(summary = "Get all loan types",
            description = "This API retrieves all available loan types.",
            responses = {
                    @ApiResponse(description = "List of loan types", responseCode = "200",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = LoanDTO.class)))
            })
    @GetMapping
    public List<LoanDTO> getAllLoans() {
        log.info("Fetching all loan types...");
        return loanService.getAllLoans()
                .stream()
                .map(LoanMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific loan type by its ID.
     *
     * @param id the ID of the loan type
     * @return the loan type data (LoanDTO)
     */
    @Operation(summary = "Get a loan type by ID",
            description = "This API retrieves a specific loan type by its ID.",
            responses = {
                    @ApiResponse(description = "Loan found", responseCode = "200",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = LoanDTO.class))),
                    @ApiResponse(description = "Loan not found", responseCode = "404")
            })
    @GetMapping("/{id}")
    public LoanDTO getLoan(@PathVariable Long id) {
        log.info("Fetching loan type by ID: {}", id);
        Loan loan = loanService.getLoanById(id);
        return LoanMapper.toDTO(loan);
    }

    /**
     * Update a loan type by its ID.
     *
     * @param id   the ID of the loan type to update
     * @param loan the updated loan data
     * @return the updated loan type data (LoanDTO)
     */
    @Operation(summary = "Update a loan type by ID",
            description = "This API updates an existing loan type with new details.",
            responses = {
                    @ApiResponse(description = "Loan updated successfully", responseCode = "200",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = LoanDTO.class))),
                    @ApiResponse(description = "Loan not found", responseCode = "404"),
                    @ApiResponse(description = "Invalid input data", responseCode = "400")
            })
    @PutMapping("/{id}")
    public LoanDTO updateLoan(@PathVariable Long id, @Valid @RequestBody Loan loan) {
        log.info("Updating loan type ID {} with new data: {}", id, loan);
        Loan updatedLoan = loanService.updateLoan(id, loan);
        log.info("Loan type updated successfully: {}", updatedLoan.getLoanType());
        return LoanMapper.toDTO(updatedLoan);
    }

    /**
     * Delete a loan type by its ID.
     *
     * @param id the ID of the loan type to delete
     * @return ResponseEntity with status code
     */
    @Operation(summary = "Delete a loan type by ID",
            description = "This API deletes a loan type by its ID.",
            responses = {
                    @ApiResponse(description = "Loan deleted successfully", responseCode = "204"),
                    @ApiResponse(description = "Loan not found", responseCode = "404")
            })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLoan(@PathVariable Long id) {
        log.info("Deleting loan type with ID: {}", id);
        loanService.deleteLoan(id);
        log.info("Loan type with ID {} deleted successfully", id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}