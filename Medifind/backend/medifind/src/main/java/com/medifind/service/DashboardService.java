package com.medifind.service;

import com.medifind.repository.InventoryRepository;
import com.medifind.repository.MedicineRepository;
import com.medifind.repository.PharmacyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PharmacyRepository pharmacyRepository;
    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;

    public Long pharmacyCount() {
        return pharmacyRepository.count();
    }

    public Long medicineCount() {
        return medicineRepository.count();
    }

    public Long inventoryCount() {
        return inventoryRepository.count();
    }
}