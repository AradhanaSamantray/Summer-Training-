package com.medifind.repository;

import com.medifind.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserEmail(String email);
    List<Booking> findByInventoryPharmacyId(Long pharmacyId);
}
