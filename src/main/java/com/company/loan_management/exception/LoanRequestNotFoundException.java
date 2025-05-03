package com.company.loan_management.exception;

public class LoanRequestNotFoundException extends RuntimeException {
  public LoanRequestNotFoundException(String message) {
    super(message);
  }
}
