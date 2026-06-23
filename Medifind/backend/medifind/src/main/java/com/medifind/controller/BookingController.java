package com.medifind.controller;

import com.medifind.dto.BookingRequest;
import com.medifind.entity.Booking;
import com.medifind.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest request, Authentication authentication) {
        return bookingService.createBooking(request, authentication.getName()); // getName() = email
    }

    @GetMapping("/my")
    public List<Booking> getMyBookings(Authentication authentication) {
        return bookingService.getMyBookings(authentication.getName());
    }

    @GetMapping("/pharmacy")
    public List<Booking> getPharmacyBookings(Authentication authentication) {
        return bookingService.getPharmacyBookings(authentication.getName());
    }

    @PutMapping("/{id}/status")
    public Booking updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {
        return bookingService.updateBookingStatus(id, status, authentication.getName());
    }
}
