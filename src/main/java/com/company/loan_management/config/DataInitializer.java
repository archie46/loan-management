package com.company.loan_management.config;


import com.company.loan_management.model.Loan;
import com.company.loan_management.model.Role;
import com.company.loan_management.model.User;
import com.company.loan_management.service.LoanService;
import com.company.loan_management.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public CommandLineRunner initData(UserService userService, LoanService loanService) {
        return args -> {
            // Create Users
            createUserIfNotExists(
                    "admin",
                    "Admin User",
                    "admin@example.com",
                    "pwd",
                    Role.ADMIN,
                    "1111111111",
                    100000.0,
                    50000.00,
                    userService
            );

            User defaultAdmin = createUserIfNotExists(
                    "john_doe",
                    "John Doe",
                    "john@example.com",
                    "password",
                    Role.USER,
                    "2222222222",
                    50000.0,
                    15000.00,
                    userService
            );

            User defaultManager = createUserIfNotExists(
                    "jane_manager",
                    "Jane Manager",
                    "jane@example.com",
                    "password",
                    Role.MANAGER,
                    "3333333333",
                    75000.0,
                    30000.00,
                    userService
            );

            User defaultFinance = createUserIfNotExists(
                    "finance_guy",
                    "Finance Guy",
                    "finance@example.com",
                    "password",
                    Role.FINANCE,
                    "4444444444",
                    80000.0,
                    40000.00,
                    userService
            );

            // Create Loans
            createLoanIfNotExists("Home Loan", 5000000.0, 7.5, 240,defaultManager, loanService);
            createLoanIfNotExists("Education Loan", 2000000.0, 5.0, 120,defaultManager, loanService);
            createLoanIfNotExists("Car Loan", 1000000.0, 8.0, 60,defaultManager, loanService);
        };
    }

    private User createUserIfNotExists(String username, String name, String email, String password, Role role, String bankAccountNumber, Double salary, Double accountBalance, UserService userService) {
        if (userService.findByUsername(username).isEmpty()) {
            User user = User.builder()
                    .username(username)
                    .name(name)
                    .email(email)
                    .password(password)
                    .role(role)
                    .bankAccountNumber(bankAccountNumber)
                    .salary(salary)
                    .accountBalance(accountBalance)
                    .department(role.name() + " Department")
                    .isActive(true)
                    .build();

            System.out.println(role.name() + " user created: " + username);
            return userService.createUser(user);
        } else {
            System.out.println(role.name() + " user already exists: " + username);
            return null;
        }
    }

    private void createLoanIfNotExists(String loanType, Double maxAmount, Double interestRate, Integer durationMonths,User approverManager, LoanService loanService) {
        if (loanService.getLoanByType(loanType).isEmpty()) { // Assuming findByLoanType exists
            Loan loan = Loan.builder()
                    .loanType(loanType)
                    .maxAmount(maxAmount)
                    .interestRate(interestRate)
                    .durationMonths(durationMonths)
                    .approverManager(approverManager)
                    .build();
            loanService.createLoan(loan);
            System.out.println("Loan created: " + loanType);
        } else {
            System.out.println("Loan already exists: " + loanType);
        }
    }

}


