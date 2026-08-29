package CloudSecurityDigitalTwin;

import CloudSecurityDigitalTwin.domain.CloudResource;
import CloudSecurityDigitalTwin.repository.CloudResourceRepository;
import CloudSecurityDigitalTwin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class CloudInventoryController {

    @Autowired
    private CloudResourceRepository cloudResourceRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public Map<String, Object> getInventory(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        String username = extractUsername(authHeader);

        List<CloudResource> resources = username != null
            ? cloudResourceRepository.findByOwnerUsername(username)
            : cloudResourceRepository.findAll();

        List<Map<String, String>> ec2 = new ArrayList<>();
        List<Map<String, String>> s3 = new ArrayList<>();

        for (CloudResource r : resources) {
            Map<String, String> item = new LinkedHashMap<>();
            if ("EC2".equals(r.getResourceType())) {
                item.put("instanceId", "i-" + r.getId());
                item.put("name", r.getName());
                item.put("instanceType", "t3.medium");
                item.put("state", r.getState());
                item.put("sensitivityLevel", r.getSensitivityLevel());
                ec2.add(item);
            } else if ("S3".equals(r.getResourceType())) {
                item.put("bucketName", r.getName());
                item.put("sensitivityLevel", r.getSensitivityLevel());
                item.put("publicAccess", r.getPublicAccess());
                s3.add(item);
            }
        }

        // Real IAM users from DB
        List<Map<String, String>> iam = new ArrayList<>();
        userRepository.findAll().forEach(u -> {
            Map<String, String> user = new LinkedHashMap<>();
            user.put("username", u.getUsername());
            user.put("role", u.getRole());
            user.put("mfaEnabled", "ADMIN".equals(u.getRole()) ? "true" : "false");
            iam.add(user);
        });

        long critical = resources.stream().filter(r -> "CRITICAL".equals(r.getSensitivityLevel())).count();
        long high = resources.stream().filter(r -> "HIGH".equals(r.getSensitivityLevel())).count();
        long medium = resources.stream().filter(r -> "MEDIUM".equals(r.getSensitivityLevel())).count();
        long low = resources.stream().filter(r -> "LOW".equals(r.getSensitivityLevel())).count();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalResources", resources.size());
        summary.put("criticalCount", critical);
        summary.put("highCount", high);
        summary.put("mediumCount", medium);
        summary.put("lowCount", low);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("ec2Instances", ec2);
        result.put("s3Buckets", s3);
        result.put("iamUsers", iam);
        result.put("summary", summary);

        return result;
    }
private String extractUsername(String authHeader) {
    if (authHeader == null) return null;
    // Format: "Bearer jwt-USERNAME-TIMESTAMP"
    String token = authHeader.replace("Bearer jwt-", "").trim();
    // Remove timestamp (last part after last dash)
    int lastDash = token.lastIndexOf("-");
    if (lastDash > 0) {
        return token.substring(0, lastDash);
    }
    return token;
}
   
}