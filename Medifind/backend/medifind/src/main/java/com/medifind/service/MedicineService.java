package com.medifind.service;

import com.medifind.entity.Medicine;
import com.medifind.exception.ResourceNotFoundException;
import com.medifind.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public Medicine addMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Medicine Not Found"));
    }

    public Medicine updateMedicine(Long id,
                                   Medicine updatedMedicine) {

        Medicine medicine = getMedicineById(id);

        medicine.setName(updatedMedicine.getName());
        medicine.setManufacturer(updatedMedicine.getManufacturer());
        medicine.setCategory(updatedMedicine.getCategory());
        medicine.setDescription(updatedMedicine.getDescription());

        return medicineRepository.save(medicine);
    }

    public String deleteMedicine(Long id) {

        medicineRepository.deleteById(id);

        return "Medicine Deleted Successfully";
    }
}