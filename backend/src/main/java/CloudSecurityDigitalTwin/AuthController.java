package CloudSecurityDigitalTwin;

import CloudSecurityDigitalTwin.domain.CloudResource;
import CloudSecurityDigitalTwin.domain.User;
import CloudSecurityDigitalTwin.repository.CloudResourceRepository;
import CloudSecurityDigitalTwin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudResourceRepository cloudResourceRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");
        String role = req.getOrDefault("role", "ANALYST");

        if (username == null || password == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password required"));

        if (userRepository.existsByUsername(username))
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));

        // Save user
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setRole(role);
        userRepository.save(user);

        // Create real resources for this user in DB
        createDefaultResources(username, role);

        String token = "jwt-" + username + "-" + System.currentTimeMillis();
        return ResponseEntity.ok(Map.of(
            "token", token,
            "username", username,
            "role", role,
            "message", "Registration successful"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            User user = userOpt.get();
            String token = "jwt-" + username + "-" + System.currentTimeMillis();
            return ResponseEntity.ok(Map.of(
                "token", token,
                "username", username,
                "role", user.getRole(),
                "message", "Login successful"
            ));
        }

        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }

    private void createDefaultResources(String username, String role) {
        // EC2 Instance
        CloudResource ec2 = new CloudResource();
        ec2.setName(username + "-web-server");
        ec2.setResourceType("EC2");
        ec2.setState("running");
        ec2.setOwnerUsername(username);
        ec2.setSensitivityLevel("ADMIN".equals(role) ? "CRITICAL" : "MEDIUM");
        ec2.setPublicAccess("false");
        cloudResourceRepository.save(ec2);

        // S3 Bucket
        CloudResource s3 = new CloudResource();
        s3.setName(username + "-data-bucket");
        s3.setResourceType("S3");
        s3.setState("active");
        s3.setOwnerUsername(username);
        s3.setSensitivityLevel("ADMIN".equals(role) ? "HIGH" : "LOW");
        s3.setPublicAccess("ANALYST".equals(role) ? "true" : "false");
        cloudResourceRepository.save(s3);

        // Bastion
        CloudResource bastion = new CloudResource();
        bastion.setName(username + "-bastion-host");
        bastion.setResourceType("EC2");
        bastion.setState("running");
        bastion.setOwnerUsername(username);
        bastion.setSensitivityLevel("ADMIN".equals(role) ? "CRITICAL" : "HIGH");
        bastion.setPublicAccess("false");
        cloudResourceRepository.save(bastion);
    }
}