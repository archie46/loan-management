package com.company.loan_management.dto;

import lombok.Data;

@Data
public class ManagerApprovalRequestDTO {
    private Long requestId;
    private Long managerId;
    private Double approvedAmount;  // Only for approval
    private String remarks;
}

