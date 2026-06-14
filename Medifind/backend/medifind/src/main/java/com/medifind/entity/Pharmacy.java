package com.medifind.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pharmacy")
@Getter
@Setter
@NoArgsConstructor

public class Pharmacy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String address;

    private Double latitude;

    private Double longitude;

    private String contact;

    @Column(nullable = false)
    private Boolean approved = false;

    @OneToOne
    @JoinColumn(name = "user_id" , unique = true)
    @JsonIgnoreProperties({"pharmacy","password"})
    private User owner;
}