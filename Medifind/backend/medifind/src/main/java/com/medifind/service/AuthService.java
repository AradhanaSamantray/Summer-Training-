package com.medifind.service;

import com.medifind.dto.AuthResponse;
import com.medifind.dto.LoginRequest;
import com.medifind.dto.RegisterRequest;
import com.medifind.entity.Role;
import com.medifind.entity.User;
import com.medifind.exception.InvalidCredentialsException;
import com.medifind.repository.UserRepository;
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

    public String register(RegisterRequest request){
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        userRepository.save(user);
        return "User Registered Successfully";
    }
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        System.out.println("Entered Password: " + request.getPassword());
        System.out.println("DB Password: " + user.getPassword());

        boolean matches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );
        System.out.println("Matches = " + matches);

        if (!matches) {
            throw new InvalidCredentialsException("Invalid Email or Password"
            );
        }

        System.out.println("User Role = " + user.getRole());

        String token =  jwtService.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token);
    }
}
