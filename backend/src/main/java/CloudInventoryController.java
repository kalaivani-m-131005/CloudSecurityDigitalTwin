package CloudSecurityDigitalTwin;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/inventory")
public class CloudInventoryController {

    @GetMapping
    public Map<String, Object> getInventory() {
        Map<String, Object> inventory = new LinkedHashMap<>();

        // EC2 Instances
        List<Map<String, String>> ec2 = new ArrayList<>();
        ec2.add(instance("i-001", "prod-web-server", "t3.medium", "running", "HIGH"));
        ec2.add(instance("i-002", "dev-api-server",  "t3.small",  "running", "MEDIUM"));
        ec2.add(instance("i-003", "bastion-host",    "t2.micro",  "running", "CRITICAL"));
        inventory.put("ec2Instances", ec2);

        // S3 Buckets
        List<Map<String, String>> s3 = new ArrayList<>();
        s3.add(bucket("prod-data-bucket",    "CRITICAL", "false"));
        s3.add(bucket("dev-logs-bucket",     "LOW",      "true"));
        s3.add(bucket("backup-store-bucket", "HIGH",     "false"));
        inventory.put("s3Buckets", s3);

        // IAM Users
        List<Map<String, String>> iam = new ArrayList<>();
        iam.add(iamUser("alice",   "AdminRole",    "true"));
        iam.add(iamUser("bob",     "ReadOnlyRole", "false"));
        iam.add(iamUser("charlie", "DevOpsRole",   "true"));
        inventory.put("iamUsers", iam);

        // Summary
        Map<String, Integer> summary = new LinkedHashMap<>();
        summary.put("totalResources", 9);
        summary.put("criticalCount",  2);
        summary.put("highCount",      2);
        summary.put("mediumCount",    1);
        summary.put("lowCount",       1);
        inventory.put("summary", summary);

        return inventory;
    }

    private Map<String, String> instance(String id, String name, String type, String state, String sensitivity) {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("instanceId",       id);
        m.put("name",             name);
        m.put("instanceType",     type);
        m.put("state",            state);
        m.put("sensitivityLevel", sensitivity);
        return m;
    }

    private Map<String, String> bucket(String name, String sensitivity, String publicAccess) {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("bucketName",       name);
        m.put("sensitivityLevel", sensitivity);
        m.put("publicAccess",     publicAccess);
        return m;
    }

    private Map<String, String> iamUser(String name, String role, String mfaEnabled) {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("username",   name);
        m.put("role",       role);
        m.put("mfaEnabled", mfaEnabled);
        return m;
    }
}