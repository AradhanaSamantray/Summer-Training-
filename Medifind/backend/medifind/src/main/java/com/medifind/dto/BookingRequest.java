package com.medifind.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long inventoryId;
    private Integer quantity;
}
