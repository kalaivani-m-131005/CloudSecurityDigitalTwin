package CloudSecurityDigitalTwin;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/graph")
public class SecurityGraphService {

    @GetMapping
    public Map<String, Object> getSecurityGraph() {
        Map<String, Object> graph = new LinkedHashMap<>();

        // Nodes
        List<Map<String, String>> nodes = new ArrayList<>();

        // Identity nodes
        nodes.add(node("identity-alice",   "alice",         "IDENTITY"));
        nodes.add(node("identity-bob",     "bob",           "IDENTITY"));
        nodes.add(node("identity-charlie", "charlie",       "IDENTITY"));

        // Role nodes
        nodes.add(node("role-admin",    "AdminRole",    "ROLE"));
        nodes.add(node("role-readonly", "ReadOnlyRole", "ROLE"));
        nodes.add(node("role-devops",   "DevOpsRole",   "ROLE"));

        // Permission nodes
        nodes.add(node("perm-admin-all",    "ALL_ACCESS",    "PERMISSION"));
        nodes.add(node("perm-read-only",    "READ_ONLY",     "PERMISSION"));
        nodes.add(node("perm-devops-write", "WRITE_DEPLOY",  "PERMISSION"));

        // Resource nodes
        nodes.add(node("res-prod-db",      "prod-data-bucket",  "RESOURCE"));
        nodes.add(node("res-bastion",      "bastion-host",      "RESOURCE"));
        nodes.add(node("res-dev-server",   "dev-api-server",    "RESOURCE"));
        nodes.add(node("res-prod-server",  "prod-web-server",   "RESOURCE"));

        graph.put("nodes", nodes);

        // Edges (Identity → Role → Permission → Resource)
        List<Map<String, String>> edges = new ArrayList<>();

        // Alice (Admin) → AdminRole → ALL_ACCESS → all resources
        edges.add(edge("identity-alice",   "role-admin",       "HAS_ROLE"));
        edges.add(edge("role-admin",       "perm-admin-all",   "HAS_PERMISSION"));
        edges.add(edge("perm-admin-all",   "res-prod-db",      "CAN_ACCESS"));
        edges.add(edge("perm-admin-all",   "res-bastion",      "CAN_ACCESS"));
        edges.add(edge("perm-admin-all",   "res-prod-server",  "CAN_ACCESS"));
        edges.add(edge("perm-admin-all",   "res-dev-server",   "CAN_ACCESS"));

        // Bob (ReadOnly) → ReadOnlyRole → READ_ONLY → dev server only
        edges.add(edge("identity-bob",     "role-readonly",    "HAS_ROLE"));
        edges.add(edge("role-readonly",    "perm-read-only",   "HAS_PERMISSION"));
        edges.add(edge("perm-read-only",   "res-dev-server",   "CAN_ACCESS"));

        // Charlie (DevOps) → DevOpsRole → WRITE_DEPLOY → prod + bastion
        edges.add(edge("identity-charlie", "role-devops",      "HAS_ROLE"));
        edges.add(edge("role-devops",      "perm-devops-write","HAS_PERMISSION"));
        edges.add(edge("perm-devops-write","res-bastion",      "CAN_ACCESS"));
        edges.add(edge("perm-devops-write","res-prod-server",  "CAN_ACCESS"));

        graph.put("edges", edges);

        // Stats
        Map<String, Integer> stats = new LinkedHashMap<>();
        stats.put("totalNodes", nodes.size());
        stats.put("totalEdges", edges.size());
        stats.put("identityNodes", 3);
        stats.put("roleNodes", 3);
        stats.put("permissionNodes", 3);
        stats.put("resourceNodes", 4);
        graph.put("stats", stats);

        return graph;
    }

    private Map<String, String> node(String id, String label, String type) {
        Map<String, String> n = new LinkedHashMap<>();
        n.put("id",    id);
        n.put("label", label);
        n.put("type",  type);
        return n;
    }

    private Map<String, String> edge(String from, String to, String relation) {
        Map<String, String> e = new LinkedHashMap<>();
        e.put("from",     from);
        e.put("to",       to);
        e.put("relation", relation);
        return e;
    }
}