package com.medifind.service;

import com.medifind.dto.AuthResponse;
import com.medifind.dto.LoginRequest;
import com.medifind.dto.RegisterRequest;
import com.medifind.entity.Role;
import com.medifind.entity.User;
import com.medifind.entity.Pharmacy;
import com.medifind.exception.InvalidCredentialsException;
import com.medifind.repository.UserRepository;
import com.medifind.repository.PharmacyRepository;
import com.medifind.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PharmacyRepository pharmacyRepository;

    public String register(RegisterRequest request){
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        User savedUser = userRepository.save(user);

        if (savedUser.getRole() == Role.PHARMACY) {
            Pharmacy pharmacy = new Pharmacy();
            pharmacy.setName(savedUser.getName());
            pharmacy.setAddress(request.getAddress());
            pharmacy.setContact(request.getContact());
            pharmacy.setLatitude(request.getLatitude());
            pharmacy.setLongitude(request.getLongitude());
            pharmacy.setOwner(savedUser);
            pharmacy.setApproved(false); // Starts unapproved
            pharmacyRepository.save(pharmacy);
        }

        return "User Registered Successfully";
    }
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        boolean matches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!matches) {
            throw new InvalidCredentialsException("Invalid Email or Password");
        }

        // 🔽 NEW: reject login if selected role doesn't match the account's actual role
        if (!user.getRole().name().equalsIgnoreCase(request.getRole())) {
            throw new InvalidCredentialsException(
                    "This account is registered as " + user.getRole().name() + ", not " + request.getRole().toUpperCase()
            );
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name(), user.getName());

        return new AuthResponse(token);
    }

    public void updateProfile(String email, String name, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(name);
        if (password != null && !password.trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }
        userRepository.save(user);
    }
}