package com.medifind;

import com.medifind.dto.BookingRequest;
import com.medifind.dto.MedicineSearchResponse;
import com.medifind.entity.Inventory;
import com.medifind.entity.Medicine;
import com.medifind.entity.Pharmacy;
import com.medifind.entity.User;
import com.medifind.repository.BookingRepository;
import com.medifind.repository.InventoryRepository;
import com.medifind.repository.MedicineRepository;
import com.medifind.repository.UserRepository;
import com.medifind.service.BookingService;
import com.medifind.service.InventoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class MedifindApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private BookingService bookingService;

    @Test
    void testDbAndSearch() {
        System.out.println("=== SYSTEM USERS ===");
        List<User> users = userRepository.findAll();
        for (User u : users) {
            System.out.println("User ID: " + u.getId() + ", Name: " + u.getName() + ", Email: " + u.getEmail() + ", Role: " + u.getRole());
        }

        System.out.println("=== SYSTEM MEDICINES ===");
        List<Medicine> medicines = medicineRepository.findAll();
        for (Medicine m : medicines) {
            System.out.println("Medicine ID: " + m.getId() + ", Name: " + m.getName() + ", Manufacturer: " + m.getManufacturer());
        }

        System.out.println("=== SYSTEM INVENTORIES ===");
        List<Inventory> inventories = inventoryRepository.findAll();
        for (Inventory i : inventories) {
            System.out.println("Inventory ID: " + i.getId() + 
                               ", Medicine: " + (i.getMedicine() != null ? i.getMedicine().getName() : "null") + 
                               ", Pharmacy: " + (i.getPharmacy() != null ? i.getPharmacy().getName() : "null") + 
                               ", Quantity: " + i.getQuantity() + 
                               ", Price: " + i.getPrice() +
                               ", Pharmacy Approved: " + (i.getPharmacy() != null ? i.getPharmacy().getApproved() : "null"));
        }

        System.out.println("=== RUNNING SEARCH ===");
        // Search using inventoryService
        List<MedicineSearchResponse> searchResult = inventoryService.searchMedicine("");
        System.out.println("Search results size: " + searchResult.size());
        for (MedicineSearchResponse res : searchResult) {
            System.out.println("Result: inventoryId=" + res.getInventoryId() + 
                               ", medicineName=" + res.getMedicineName() + 
                               ", pharmacyName=" + res.getPharmacyName() + 
                               ", price=" + res.getPrice() + 
                               ", quantity=" + res.getQuantity());
        }
    }
}

