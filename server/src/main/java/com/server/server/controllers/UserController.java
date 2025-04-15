package com.server.server.controllers;
import com.server.server.models.User;
import com.server.server.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    @PostMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("POST works!");
    }
    @PostMapping("/create")
    public ResponseEntity<User> create(@RequestBody User user) {
        System.out.println("Started");
        try{
        System.out.println("controller");
        return ResponseEntity.ok(userService.createUser(user));
        }
        catch(Exception e){
            System.out.println("error:" + e);
            return ResponseEntity.ok(userService.createUser(user));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<User> get(@PathVariable Long id) {
        return userService.getUser(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
