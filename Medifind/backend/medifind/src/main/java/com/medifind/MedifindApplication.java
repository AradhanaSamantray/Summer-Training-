package com.medifind;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.medifind.repository.UserRepository;
import com.medifind.entity.User;
import com.medifind.entity.Role;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class MedifindApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedifindApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                User admin = new User();
                admin.setName("System Administrator");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(passwordEncoder.encode("123456"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Default administrator (admin@gmail.com) created.");
            }
        };
    }

}

