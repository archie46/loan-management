package com.company.loan_management.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true,nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Double salary;

    @Column(nullable = false)
    private String bankAccountNumber;

    private String department;

    @Column(unique = true, nullable = false)
    private String username;

    private boolean isActive = true;
}