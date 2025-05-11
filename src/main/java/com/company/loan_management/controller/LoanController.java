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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

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
    public ResponseEntity<LoanDTO> createLoan(@Valid @RequestBody Loan loan) {
        log.info("Creating loan type: {}", loan.getLoanType());
        Loan savedLoan = loanService.createLoan(loan);
        log.info("Loan type created: {}", savedLoan.getLoanType());
        URI location = URI.create("/api/loans/" + savedLoan.getId());
        return ResponseEntity.created(location).body(LoanMapper.toDTO(savedLoan));
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
    public ResponseEntity<List<LoanDTO>> getAllLoans() {
        log.info("Fetching all loan types...");
        List<LoanDTO> loanDTOs = loanService.getAllLoans()
                .stream()
                .map(LoanMapper::toDTO)
                .toList();
        return ResponseEntity.ok(loanDTOs);
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
    public ResponseEntity<LoanDTO> getLoan(@PathVariable Long id) {
        log.info("Fetching loan type by ID: {}", id);
        Loan loan = loanService.getLoanById(id); // throws LoanNotFoundException if not found
        return ResponseEntity.ok(LoanMapper.toDTO(loan));
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
    public ResponseEntity<LoanDTO> updateLoan(@PathVariable Long id, @Valid @RequestBody Loan loan) {
        log.info("Updating loan ID {} with new data", id);
        Loan updatedLoan = loanService.updateLoan(id, loan); // throws LoanNotFoundException if not found
        return ResponseEntity.ok(LoanMapper.toDTO(updatedLoan));
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
        loanService.deleteLoan(id); // throws LoanNotFoundException if not found
        return ResponseEntity.noContent().build();
    }
}