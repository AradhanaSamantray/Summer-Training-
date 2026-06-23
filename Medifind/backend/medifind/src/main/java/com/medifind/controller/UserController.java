package com.medifind.controller;

import com.medifind.dto.RegisterRequest;
import com.medifind.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @PutMapping("/profile")
    public String updateProfile(@RequestBody RegisterRequest request, Authentication authentication) {
        authService.updateProfile(authentication.getName(), request.getName(), request.getPassword());
        return "Profile updated successfully";
    }
}
