package com.server.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.server.server.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
}