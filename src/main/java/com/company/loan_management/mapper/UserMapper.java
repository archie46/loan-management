package com.company.loan_management.mapper;

import com.company.loan_management.dto.ManagerDTO;
import com.company.loan_management.dto.UserDTO;
import com.company.loan_management.model.User;
import com.company.loan_management.model.Role;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserMapper {

    private UserMapper(){}


    // Logger to log the mapping process
    private static final Logger logger = LoggerFactory.getLogger(UserMapper.class);

    /**
     * Converts a User entity to a UserDTO.
     *
     * @param user The User entity to be converted.
     * @return The corresponding UserDTO.
     */
    public static UserDTO toDTO(@NotNull User user) {
        logger.info("Mapping User entity to UserDTO for user with ID: {}", user.getId());

        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .salary(user.getSalary())
                .bankAccountNumber(user.getBankAccountNumber())
                .accountBalance(user.getAccountBalance())
                .department(user.getDepartment())
                .build();

        logger.info("UserDTO created successfully for user with ID: {}", user.getId());
        return userDTO;
    }

    /**
     * Manager mapping: Converts a User entity to a smaller ManagerDTO.
     */
    public static ManagerDTO toManagerDTO(@NotNull User user) {
        logger.info("Mapping User entity to ManagerDTO for user with ID: {}", user.getId());

        ManagerDTO managerDTO = ManagerDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .department(user.getDepartment())
                .build();

        logger.info("ManagerDTO created successfully for user with ID: {}", user.getId());
        return managerDTO;
    }


    /**
     * Converts a UserDTO to a User entity.
     *
     * @param userDTO The UserDTO to be converted.
     * @return The corresponding User entity.
     */
    public static User toEntity(@NotNull UserDTO userDTO) {
        logger.info("Mapping UserDTO to User entity for user with ID: {}", userDTO.getId());

        User user = User.builder()
                .id(userDTO.getId())
                .name(userDTO.getName())
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .role(Role.valueOf(userDTO.getRole()))
                .salary(userDTO.getSalary())
                .bankAccountNumber(userDTO.getBankAccountNumber())
                .department(userDTO.getDepartment())
                .build();

        logger.info("User entity created successfully for user with ID: {}", userDTO.getId());
        return user;
    }
}

