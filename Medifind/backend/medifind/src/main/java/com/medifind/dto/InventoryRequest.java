package com.medifind.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class InventoryRequest {

    private Long pharmacyId;
    private Long medicineId;
    private Integer quantity;
    private Double price;
    private LocalDate expiryDate;
}