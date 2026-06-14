package com.medifind.repository;

import com.medifind.entity.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PharmacyRepository extends JpaRepository<Pharmacy,Long> {
    List<Pharmacy> findByApprovedFalse();
}
