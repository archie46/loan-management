package com.company.loan_management.mapper;

import com.company.loan_management.dto.UserDTO;
import com.company.loan_management.model.User;
import com.company.loan_management.model.Role;
import org.jetbrains.annotations.NotNull;

public class UserMapper {

    // Mapping User to UserDTO
    public static UserDTO toDTO(@NotNull User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name()) // Convert Role enum to String
                .salary(user.getSalary())
                .bankAccountNumber(user.getBankAccountNumber())
                .build();
    }

    public static User toEntity(@NotNull UserDTO userDTO) {
        return User.builder()
                .id(userDTO.getId())
                .name(userDTO.getName())
                .email(userDTO.getEmail())
                .role(Role.valueOf(userDTO.getRole())) // Convert String to Role enum
                .salary(userDTO.getSalary())
                .bankAccountNumber(userDTO.getBankAccountNumber())
                .build();
    }
}