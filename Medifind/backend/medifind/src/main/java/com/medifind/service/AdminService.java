package com.medifind.service;

import com.medifind.entity.Pharmacy;
import com.medifind.entity.Role;
import com.medifind.exception.ResourceNotFoundException;
import com.medifind.repository.PharmacyRepository;
import com.medifind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public List<Pharmacy> getApprovedPharmacies() {
        return pharmacyRepository.findByApprovedTrue();
    }
    private final UserRepository userRepository;

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.countByRole(Role.USER));
        stats.put("totalPharmacies", pharmacyRepository.count());
        stats.put("pendingPharmacies", (long) pharmacyRepository.findByApprovedFalse().size());
        return stats;
    }
}