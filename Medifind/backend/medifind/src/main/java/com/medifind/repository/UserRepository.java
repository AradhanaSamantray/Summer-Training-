package com.medifind.repository;

import com.medifind.entity.Role;
import com.medifind.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
    long countByRole(Role role);

}
