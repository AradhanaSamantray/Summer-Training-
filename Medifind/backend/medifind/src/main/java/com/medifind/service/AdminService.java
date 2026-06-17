package com.medifind.service;

import com.medifind.entity.Pharmacy;
import com.medifind.exception.ResourceNotFoundException;
import com.medifind.repository.PharmacyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final PharmacyRepository pharmacyRepository;

    public String approvePharmacy(Long id) {

        Pharmacy pharmacy =
                pharmacyRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Pharmacy Not Found"
                                ));

        pharmacy.setApproved(true);

        pharmacyRepository.save(pharmacy);

        return "Pharmacy Approved Successfully";
    }
    public List<Pharmacy> getPendingPharmacies(){
        return pharmacyRepository.findByApprovedFalse();
    }
}