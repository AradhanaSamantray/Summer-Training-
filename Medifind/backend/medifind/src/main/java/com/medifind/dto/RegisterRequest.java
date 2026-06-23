package com.medifind.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;
    private String address;
    private String contact;
    private Double latitude;
    private Double longitude;
}
