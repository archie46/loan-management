package com.company.loan_management.config;


import com.company.loan_management.model.Role;
import com.company.loan_management.model.User;
import com.company.loan_management.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Check if admin exists in the database, if not, create one

            User admin = User.builder()
                    .username("admin")
                    .name("Admin User")
                    .email("admin@example.com")
                    .password("pwd") // Secure the password
                    .role(Role.ADMIN)
                    .bankAccountNumber("123456789")
                    .salary(100000.0)
                    .department("Administration")
                    .isActive(true)
                    .build();

            userService.createUser(admin);
            System.out.println("Admin user created!");

        };
    }
}


