package com.company.loan_management.exception;

public class RepaymentNotFoundException extends RuntimeException {
    public RepaymentNotFoundException(String message) {
        super(message);
    }
}
