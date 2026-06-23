package com.medifind.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicineSearchResponse {

    private Long inventoryId;

    private String pharmacyName;

    private String medicineName;

    private Integer quantity;

    private Double price;

    private String address;

    private String contact;

    private Double latitude;

    private Double longitude;

}