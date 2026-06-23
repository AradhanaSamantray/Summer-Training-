package com.medifind.service;

import com.medifind.dto.BookingRequest;
import com.medifind.entity.Booking;
import com.medifind.entity.Inventory;
import com.medifind.entity.User;
import com.medifind.exception.ResourceNotFoundException;
import com.medifind.repository.BookingRepository;
import com.medifind.repository.InventoryRepository;
import com.medifind.repository.UserRepository;
import com.medifind.repository.PharmacyRepository;
import com.medifind.entity.Pharmacy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;
    private final PharmacyRepository pharmacyRepository;

    public List<Booking> getPharmacyBookings(String email) {
        Pharmacy pharmacy = pharmacyRepository.findByOwnerEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Pharmacy not found"));
        return bookingRepository.findByInventoryPharmacyId(pharmacy.getId());
    }

    public Booking updateBookingStatus(Long bookingId, String status, String email) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isPharmacy = false;
        Pharmacy pharmacy = pharmacyRepository.findByOwnerEmail(email).orElse(null);
        if (pharmacy != null && booking.getInventory().getPharmacy().getId().equals(pharmacy.getId())) {
            isPharmacy = true;
        }

        boolean isBookingOwner = booking.getUser().getId().equals(user.getId());

        if (!isPharmacy && !isBookingOwner) {
            throw new RuntimeException("Unauthorized to update this booking");
        }

        // If booking is transitioning to CANCELLED or REJECTED, restore stock quantity to inventory
        boolean isPreviousRestored = "CANCELLED".equalsIgnoreCase(booking.getStatus()) || "REJECTED".equalsIgnoreCase(booking.getStatus());
        boolean isNewRestored = "CANCELLED".equalsIgnoreCase(status) || "REJECTED".equalsIgnoreCase(status);
        if (isNewRestored && !isPreviousRestored) {
            Inventory inv = booking.getInventory();
            inv.setQuantity(inv.getQuantity() + booking.getQuantity());
            inventoryRepository.save(inv);
        }

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public Booking createBooking(BookingRequest req, String email) {
        Inventory inv = inventoryRepository.findById(req.getInventoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found"));

        if (inv.getQuantity() < req.getQuantity())
            throw new RuntimeException("Insufficient stock");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Deduct stock
        inv.setQuantity(inv.getQuantity() - req.getQuantity());
        inventoryRepository.save(inv);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setInventory(inv);
        booking.setQuantity(req.getQuantity());
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    public List<Booking> getMyBookings(String email) {

        return bookingRepository.findByUserEmail(email);
    }
}

