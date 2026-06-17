package com.medifind.service;

import com.medifind.dto.InventoryRequest;
import com.medifind.dto.MedicineSearchResponse;
import com.medifind.entity.Inventory;
import com.medifind.entity.Medicine;
import com.medifind.entity.Pharmacy;
import com.medifind.repository.InventoryRepository;
import com.medifind.repository.MedicineRepository;
import com.medifind.repository.PharmacyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final PharmacyRepository pharmacyRepository;
    private final MedicineRepository medicineRepository;

    public Inventory addInventory(InventoryRequest request) {

        Pharmacy pharmacy = pharmacyRepository
                .findById(request.getPharmacyId())
                .orElseThrow(() ->
                        new RuntimeException("Pharmacy Not Found"));

        Medicine medicine = medicineRepository
                .findById(request.getMedicineId())
                .orElseThrow(() ->
                        new RuntimeException("Medicine Not Found"));

        Inventory inventory = new Inventory();

        inventory.setPharmacy(pharmacy);
        inventory.setMedicine(medicine);
        inventory.setQuantity(request.getQuantity());
        inventory.setPrice(request.getPrice());
        inventory.setExpiryDate(request.getExpiryDate());

        return inventoryRepository.save(inventory);
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public Inventory getInventoryById(Long id) {

        return inventoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Inventory Not Found"));
    }

    public Inventory updateInventory(
            Long id,
            InventoryRequest request) {

        Inventory inventory = getInventoryById(id);

        Pharmacy pharmacy = pharmacyRepository
                .findById(request.getPharmacyId())
                .orElseThrow(() ->
                        new RuntimeException("Pharmacy Not Found"));

        Medicine medicine = medicineRepository
                .findById(request.getMedicineId())
                .orElseThrow(() ->
                        new RuntimeException("Medicine Not Found"));

        inventory.setPharmacy(pharmacy);
        inventory.setMedicine(medicine);
        inventory.setQuantity(request.getQuantity());
        inventory.setPrice(request.getPrice());
        inventory.setExpiryDate(request.getExpiryDate());

        return inventoryRepository.save(inventory);
    }

    public String deleteInventory(Long id) {

        inventoryRepository.deleteById(id);

        return "Inventory Deleted Successfully";
    }
    public List<MedicineSearchResponse> searchMedicine(
            String medicineName) {

        List<Inventory> inventoryList =
                inventoryRepository.searchMedicine(
                        medicineName);

        return inventoryList.stream()
                .filter(i -> Boolean.TRUE.equals(i.getPharmacy().getApproved()))
                .map(i -> new MedicineSearchResponse(
                        i.getPharmacy().getName(),
                        i.getMedicine().getName(),
                        i.getQuantity(),
                        i.getPrice(),
                        i.getPharmacy().getAddress(),
                        i.getPharmacy().getContact()
                        ))
                .toList();
    }
}