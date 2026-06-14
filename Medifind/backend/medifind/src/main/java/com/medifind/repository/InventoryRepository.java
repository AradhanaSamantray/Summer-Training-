package com.medifind.repository;

import com.medifind.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    @Query("""
            SELECT i
            FROM Inventory i
            WHERE LOWER(i.medicine.name)
            LIKE LOWER(CONCAT('%', :medicineName, '%')) 
            AND i.quantity > 0
           """)
    List<Inventory> searchMedicine(@Param("medicineName")String medicineName);
}