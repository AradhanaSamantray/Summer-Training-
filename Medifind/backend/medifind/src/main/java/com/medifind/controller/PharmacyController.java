package com.medifind.controller;

import com.medifind.entity.Pharmacy;
import com.medifind.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
public class PharmacyController {

    private final PharmacyService pharmacyService;

    @PostMapping
    @PreAuthorize("hasRole('PHARMACY')")
    public Pharmacy addPharmacy(@RequestBody Pharmacy pharmacy, Authentication authentication) {

        return pharmacyService.addPharmacy(pharmacy, authentication.getName());
    }

    @GetMapping
    public List<Pharmacy> getAllPharmacies() {
        return pharmacyService.getAllPharmacies();
    }

    @GetMapping("/approved")
    public List<Pharmacy> getApprovedPharmacies() {
        return pharmacyService.getApprovedPharmacies();
    }

    @GetMapping("/profile")
    public Pharmacy getMyProfile(Authentication authentication) {
        return pharmacyService.getMyPharmacy(authentication.getName());
    }

    @GetMapping("/{id}")
    public Pharmacy getPharmacyById(
            @PathVariable Long id) {

        return pharmacyService.getPharmacyById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACY')")
    public Pharmacy updatePharmacy(@PathVariable Long id, @RequestBody Pharmacy pharmacy, Authentication authentication) {

        return pharmacyService.updatePharmacy(
                id,
                pharmacy,
                authentication.getName());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACY')")
    public String deletePharmacy(
            @PathVariable Long id) {

        return pharmacyService.deletePharmacy(id);
    }
}