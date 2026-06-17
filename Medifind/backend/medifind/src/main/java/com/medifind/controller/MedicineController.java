package com.medifind.controller;

import com.medifind.entity.Medicine;
import com.medifind.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicine")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @PostMapping
    public Medicine addMedicine(
            @RequestBody Medicine medicine) {

        return medicineService.addMedicine(medicine);
    }

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    @GetMapping("/{id}")
    public Medicine getMedicineById(
            @PathVariable Long id) {

        return medicineService.getMedicineById(id);
    }

    @PutMapping("/{id}")
    public Medicine updateMedicine(
            @PathVariable Long id,
            @RequestBody Medicine medicine) {

        return medicineService.updateMedicine(
                id,
                medicine
        );
    }

    @DeleteMapping("/{id}")
    public String deleteMedicine(
            @PathVariable Long id) {

        return medicineService.deleteMedicine(id);
    }
}