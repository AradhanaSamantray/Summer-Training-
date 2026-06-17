package com.medifind.controller;

import com.medifind.dto.InventoryRequest;
import com.medifind.dto.MedicineSearchResponse;
import com.medifind.entity.Inventory;
import com.medifind.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    public Inventory addInventory(
            @RequestBody InventoryRequest request) {

        return inventoryService.addInventory(request);
    }

    @GetMapping
    public List<Inventory> getAllInventory() {

        return inventoryService.getAllInventory();
    }

    @GetMapping("/{id}")
    public Inventory getInventoryById(
            @PathVariable Long id) {

        return inventoryService.getInventoryById(id);
    }

    @GetMapping("/search")
    public List<MedicineSearchResponse> searchMedicine(
            @RequestParam String medicineName) {

        return inventoryService.searchMedicine(
                medicineName
        );
    }

    @PutMapping("/{id}")
    public Inventory updateInventory(
            @PathVariable Long id,
            @RequestBody InventoryRequest request) {

        return inventoryService.updateInventory(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteInventory(
            @PathVariable Long id) {

        return inventoryService.deleteInventory(id);
    }
}