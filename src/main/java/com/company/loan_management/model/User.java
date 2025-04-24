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

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String password;

    private Double salary;

    private String bankAccountNumber;

    private String department;

    @Column(unique = true)
    private String username;
}