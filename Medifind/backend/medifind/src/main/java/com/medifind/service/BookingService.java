package com.medifind.service;

import com.medifind.dto.BookingRequest;
import com.medifind.entity.Booking;
import com.medifind.entity.Inventory;
import com.medifind.entity.User;
import com.medifind.exception.ResourceNotFoundException;
import com.medifind.repository.BookingRepository;
import com.medifind.repository.InventoryRepository;
import com.medifind.repository.UserRepository;
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

