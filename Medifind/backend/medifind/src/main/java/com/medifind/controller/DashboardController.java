package com.medifind.controller;

import com.medifind.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/pharmacies/count")
    public Long pharmacyCount() {
        return dashboardService.pharmacyCount();
    }

    @GetMapping("/medicines/count")
    public Long medicineCount() {
        return dashboardService.medicineCount();
    }

    @GetMapping("/inventory/count")
    public Long inventoryCount() {
        return dashboardService.inventoryCount();
    }
}