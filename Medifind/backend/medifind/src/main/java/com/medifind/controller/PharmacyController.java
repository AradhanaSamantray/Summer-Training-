package com.medifind.controller;

import com.medifind.entity.Pharmacy;
import com.medifind.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
public class PharmacyController {

    private final PharmacyService pharmacyService;

    @PostMapping
    public Pharmacy addPharmacy(@RequestBody Pharmacy pharmacy, Authentication authentication) {

        return pharmacyService.addPharmacy(pharmacy, authentication.getName());
    }

    @GetMapping
    public List<Pharmacy> getAllPharmacies() {
        return pharmacyService.getAllPharmacies();
    }

    @GetMapping("/{id}")
    public Pharmacy getPharmacyById(
            @PathVariable Long id) {

        return pharmacyService.getPharmacyById(id);
    }

    @PutMapping("/{id}")
    public Pharmacy updatePharmacy(@PathVariable Long id, @RequestBody Pharmacy pharmacy,Authentication authentication) {

        return pharmacyService.updatePharmacy(
                id,
                pharmacy,
                authentication.getName());
    }

    @DeleteMapping("/{id}")
    public String deletePharmacy(
            @PathVariable Long id) {

        return pharmacyService.deletePharmacy(id);
    }
}