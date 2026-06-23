package com.medifind.service;

import com.medifind.entity.Pharmacy;
import com.medifind.entity.User;
import com.medifind.exception.ResourceNotFoundException;
import com.medifind.repository.PharmacyRepository;
import com.medifind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PharmacyService {

    private final PharmacyRepository pharmacyRepository;
    private final UserRepository userRepository;

    public Pharmacy addPharmacy(Pharmacy pharmacy, String email) {
        User owner = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        pharmacy.setOwner(owner);
        pharmacy.setApproved(false);  // always starts unapproved
        return pharmacyRepository.save(pharmacy);
    }

    public List<Pharmacy> getAllPharmacies() {

        return pharmacyRepository.findAll();
    }

    public List<Pharmacy> getApprovedPharmacies() {
        return pharmacyRepository.findByApprovedTrue();
    }

    public Pharmacy getMyPharmacy(String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (owner.getPharmacy() == null) {
            throw new ResourceNotFoundException("No pharmacy registered for this account");
        }

        return owner.getPharmacy();
    }

    public Pharmacy getPharmacyById(Long id) {
        return pharmacyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Pharmacy Not Found"));
    }

    public Pharmacy updatePharmacy(Long id, Pharmacy updatedPharmacy,String callerEmail) {

        Pharmacy pharmacy = getPharmacyById(id);

        if(!pharmacy.getOwner().getEmail().equals(callerEmail)){
            throw new RuntimeException("You are not the owner of this pharmacy");
        }

        pharmacy.setName(updatedPharmacy.getName());
        pharmacy.setAddress(updatedPharmacy.getAddress());
        pharmacy.setLatitude(updatedPharmacy.getLatitude());
        pharmacy.setLongitude(updatedPharmacy.getLongitude());
        pharmacy.setContact(updatedPharmacy.getContact());

        return pharmacyRepository.save(pharmacy);
    }

    public String deletePharmacy(Long id) {

        pharmacyRepository.deleteById(id);

        return "Pharmacy Deleted Successfully";
    }
}