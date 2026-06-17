package com.medifind.controller;

import com.medifind.entity.Pharmacy;
import com.medifind.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PutMapping("/pharmacy/{id}/approve")
    public String approvePharmacy(@PathVariable Long id, Authentication authentication) {
        /*System.out.println("CONTROLLER AUTH = " + authentication);
        return adminService.approvePharmacy(id);*/
        System.out.println("ADMIN ENDPOINT HIT");
        return "Approved";
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pharmacy/pending")
    public List<Pharmacy> getPendingPharmacies() {
        return adminService.getPendingPharmacies();
    }
}