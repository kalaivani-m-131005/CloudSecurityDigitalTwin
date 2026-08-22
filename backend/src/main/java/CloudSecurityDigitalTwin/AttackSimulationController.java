package CloudSecurityDigitalTwin;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/simulate")
public class AttackSimulationController {

    // Same graph data — reused from SecurityGraphService
    private static final Map<String, List<String>> GRAPH = new LinkedHashMap<>();
    private static final Map<String, String> NODE_TYPE = new LinkedHashMap<>();
    private static final Map<String, Integer> SENSITIVITY = new LinkedHashMap<>();

    static {
        // Edges
        GRAPH.put("identity-alice",   List.of("role-admin"));
        GRAPH.put("identity-bob",     List.of("role-readonly"));
        GRAPH.put("identity-charlie", List.of("role-devops"));
        GRAPH.put("role-admin",       List.of("perm-admin-all"));
        GRAPH.put("role-readonly",    List.of("perm-read-only"));
        GRAPH.put("role-devops",      List.of("perm-devops-write"));
        GRAPH.put("perm-admin-all",   List.of("res-prod-db","res-bastion","res-prod-server","res-dev-server"));
        GRAPH.put("perm-read-only",   List.of("res-dev-server"));
        GRAPH.put("perm-devops-write",List.of("res-bastion","res-prod-server"));

        // Node types
        NODE_TYPE.put("identity-alice",    "IDENTITY");
        NODE_TYPE.put("identity-bob",      "IDENTITY");
        NODE_TYPE.put("identity-charlie",  "IDENTITY");
        NODE_TYPE.put("role-admin",        "ROLE");
        NODE_TYPE.put("role-readonly",     "ROLE");
        NODE_TYPE.put("role-devops",       "ROLE");
        NODE_TYPE.put("perm-admin-all",    "PERMISSION");
        NODE_TYPE.put("perm-read-only",    "PERMISSION");
        NODE_TYPE.put("perm-devops-write", "PERMISSION");
        NODE_TYPE.put("res-prod-db",       "RESOURCE");
        NODE_TYPE.put("res-bastion",       "RESOURCE");
        NODE_TYPE.put("res-dev-server",    "RESOURCE");
        NODE_TYPE.put("res-prod-server",   "RESOURCE");

        // Sensitivity weights (for risk score)
        SENSITIVITY.put("res-prod-db",     100); // CRITICAL
        SENSITIVITY.put("res-bastion",     100); // CRITICAL
        SENSITIVITY.put("res-prod-server",  75); // HIGH
        SENSITIVITY.put("res-dev-server",   50); // MEDIUM
    }

    @PostMapping
    public Map<String, Object> simulate(@RequestBody Map<String, String> request) {
        String identityId = request.get("identityId");

        if (identityId == null || !GRAPH.containsKey(identityId)) {
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("error", "Invalid identityId. Use: identity-alice, identity-bob, identity-charlie");
            return error;
        }

        // BFS — find all reachable nodes
        List<List<String>> attackPaths = new ArrayList<>();
        List<String> reachableResources = new ArrayList<>();
        bfs(identityId, new ArrayList<>(), attackPaths, reachableResources);

        // Blast radius
        int blastRadius = reachableResources.size();

        // Risk score formula:
        // avg sensitivity of reachable resources × (blastRadius / totalResources) × 100
        int totalSensitivity = reachableResources.stream()
                .mapToInt(r -> SENSITIVITY.getOrDefault(r, 25))
                .sum();
        double avgSensitivity = blastRadius > 0 ? (double) totalSensitivity / blastRadius : 0;
        double riskScore = Math.min(100, (avgSensitivity * blastRadius) / 4.0);

        // Response
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("identityId",          identityId);
        result.put("attackPaths",          attackPaths);
        result.put("reachableResources",   reachableResources);
        result.put("blastRadius",          blastRadius);
        result.put("riskScore",            Math.round(riskScore));
        result.put("riskLevel",            riskLevel((int) Math.round(riskScore)));

        return result;
    }

    private void bfs(String start, List<String> currentPath,
                     List<List<String>> allPaths, List<String> resources) {
        currentPath.add(start);
        List<String> neighbors = GRAPH.getOrDefault(start, List.of());

        if (neighbors.isEmpty()) {
            allPaths.add(new ArrayList<>(currentPath));
            if ("RESOURCE".equals(NODE_TYPE.get(start))) {
                resources.add(start);
            }
        } else {
            for (String neighbor : neighbors) {
                bfs(neighbor, new ArrayList<>(currentPath), allPaths, resources);
            }
        }
        if ("RESOURCE".equals(NODE_TYPE.get(start)) && !resources.contains(start)) {
            resources.add(start);
        }
    }

    private String riskLevel(int score) {
        if (score >= 80) return "CRITICAL";
        if (score >= 60) return "HIGH";
        if (score >= 40) return "MEDIUM";
        return "LOW";
    }
}