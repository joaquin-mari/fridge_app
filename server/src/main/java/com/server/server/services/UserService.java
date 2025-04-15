package com.server.server.services;

import com.server.server.repositories.UserRepository;
import com.server.server.repositories.InterestRepository;
import com.server.server.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final InterestRepository interestRepository;

    public User createUser(User user) {
        try{
        // Attach interests if IDs are provided (optional logic)
        if (user.getInterests() != null && !user.getInterests().isEmpty()) {
            Set<Long> interestIds = user.getInterests().stream()
                    .map(interest -> interest.getId())
                    .collect(java.util.stream.Collectors.toSet());

            var interests = interestRepository.findAllById(interestIds);
            user.setInterests(new java.util.HashSet<>(interests));
        }

        // If Fridge is present, link the user (bi-directional mapping)
        if (user.getFridge() != null) {
            user.getFridge().setUser(user);
        }
    }
    catch(Exception e){
        System.out.println(e);
    }
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setName(updatedUser.getName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPassword(updatedUser.getPassword());
            existingUser.setHeight(updatedUser.getHeight());
            existingUser.setWeight(updatedUser.getWeight());
            existingUser.setGender(updatedUser.getGender());

            // Handle interests
            if (updatedUser.getInterests() != null && !updatedUser.getInterests().isEmpty()) {
                Set<Long> interestIds = updatedUser.getInterests().stream()
                        .map(interest -> interest.getId())
                        .collect(java.util.stream.Collectors.toSet());

                var interests = interestRepository.findAllById(interestIds);
                existingUser.setInterests(new java.util.HashSet<>(interests));
            }

            // Handle fridge (overwrite or update)
            if (updatedUser.getFridge() != null) {
                updatedUser.getFridge().setUser(existingUser);
                existingUser.setFridge(updatedUser.getFridge());
            }

            return userRepository.save(existingUser);
        }).orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    public Optional<User> getUser(Long id) {
        return userRepository.findById(id);
    }
}
