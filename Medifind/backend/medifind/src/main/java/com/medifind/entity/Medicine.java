package com.medifind.entity;
import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "medicine")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String name;
    private String manufacturer;
    private String category;
    private String description;

}
