package com.medifind.controller;

import com.medifind.entity.Pharmacy;
import com.medifind.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PutMapping("/pharmacy/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public String approvePharmacy(@PathVariable Long id) {
        return adminService.approvePharmacy(id);
    }
    @GetMapping("/pharmacy/pending")
    public List<Pharmacy> getPendingPharmacies() {

        return adminService.getPendingPharmacies();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pharmacy/approved")
    public List<Pharmacy> getApprovedPharmacies() {
        return adminService.getApprovedPharmacies();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        return adminService.getStats();
    }
}