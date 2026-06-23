package com.medifind.controller;

import com.medifind.dto.MedicineSearchResponse;
import com.medifind.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final InventoryService inventoryService;

    @GetMapping
    public List<MedicineSearchResponse> searchMedicine(
            @RequestParam String medicineName) {

        return inventoryService.searchMedicine(medicineName);
    }
}